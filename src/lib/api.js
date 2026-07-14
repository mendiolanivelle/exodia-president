export async function sendMessage(messages, options = {}) {
  const { signal } = options;
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal: signal || (AbortSignal.timeout ? AbortSignal.timeout(120000) : undefined),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || err.message || `Server error: ${response.status}`);
  }

  return response.body;
}

export async function readStreamingResponse(body, onText) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;

      const data = line.slice(6).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          accumulated += delta;
          onText(accumulated);
        }
      } catch {
        buffer = `${line}\n${buffer}`;
      }
    }
  }

  return accumulated;
}