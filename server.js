import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'openai/gpt-4o-mini';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
const GOOGLE_DOC_ID = process.env.GOOGLE_DOC_ID || '';

const SYSTEM_PROMPT =
  'You are the President of Exodia, a visionary leader overseeing game development, technology, and innovation. ' +
  'You address citizens with wisdom, authority, and warmth. ' +
  'Respond formally but approachably, as a president would to their people. ' +
  'Keep answers concise and inspiring. You lead a nation built on creativity and code.';

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function parseTable(table) {
  const rows = [];
  for (const row of table.tableRows || []) {
    const cells = [];
    for (const cell of row.tableCells || []) {
      const text = (cell.content || [])
        .map((el) => (el.paragraph?.elements || [])
          .map((e) => e.textRun?.content || '')
          .join(''))
        .join('')
        .trim();
      cells.push(text);
    }
    if (cells.some((c) => c)) rows.push(cells);
  }
  return rows;
}

function transformDoc(doc) {
  const sections = [];
  const content = doc.body?.content || [];

  for (const el of content) {
    if (el.paragraph) {
      const para = el.paragraph;
      const text = (para.elements || [])
        .map((e) => e.textRun?.content || '')
        .join('')
        .trim();
      if (!text) {
        sections.push({ type: 'break' });
        continue;
      }

      const style = para.paragraphStyle?.namedStyleType;
      if (style === 'HEADING_1') sections.push({ type: 'h1', text });
      else if (style === 'HEADING_2') sections.push({ type: 'h2', text });
      else if (style === 'HEADING_3') sections.push({ type: 'h3', text });
      else if (para.bullet) sections.push({ type: 'bullet', text });
      else sections.push({ type: 'p', text });
    }
    if (el.table) {
      sections.push({ type: 'table', rows: parseTable(el.table) });
    }
  }

  return {
    title: doc.title || '',
    sections,
  };
}

let docCache = { data: null, ts: 0 };

async function fetchDocContent() {
  if (docCache.data && Date.now() - docCache.ts < 30_000) {
    return docCache.data;
  }

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_DOC_ID) {
    throw new Error('Google Doc configuration missing on server.');
  }

  const key = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim();

  const jwt = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    key,
    ['https://www.googleapis.com/auth/documents.readonly'],
  );

  try {
    await jwt.authorize();
  } catch (authErr) {
    console.error('JWT authorize failed:', authErr.message);
    throw new Error(`Auth failed: ${authErr.message}`);
  }

  const docs = google.docs({ version: 'v1', auth: jwt });
  const res = await docs.documents.get({ documentId: GOOGLE_DOC_ID });
  const content = transformDoc(res.data);

  docCache = { data: content, ts: Date.now() };
  return content;
}

function serveStatic(req, res) {
  const urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      filePath = path.join(DIST, 'index.html');
      fs.readFile(filePath, (err2, data2) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        }
      });
    } else {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
}

function proxyChat(req, res) {
  if (!OPENROUTER_KEY) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'OpenRouter API key not configured on server.' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    let parsed;
    try { parsed = JSON.parse(body); } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
      return;
    }

    const { messages = [] } = parsed;

    const proxyReq = https.request(
      {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.host || '',
          'X-Title': 'Exodia President Chat',
        },
        timeout: 120000,
      },
      (proxyRes) => {
        if (proxyRes.statusCode !== 200) {
          let errBody = '';
          proxyRes.on('data', (chunk) => { errBody += chunk; });
          proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(errBody);
          });
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        });

        proxyRes.pipe(res);
      },
    );

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.write(
      JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        stream: true,
      }),
    );

    proxyReq.end();
  });
}

async function serveDocApi(req, res) {
  try {
    const content = await fetchDocContent();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(content));
  } catch (err) {
    console.error('Doc API error:', err.message, err.stack);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === 'POST' && url.pathname === '/api/chat') {
      proxyChat(req, res);
    } else if (req.method === 'GET' && url.pathname === '/api/doc') {
      serveDocApi(req, res);
    } else {
      serveStatic(req, res);
    }
  })
  .listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
  });