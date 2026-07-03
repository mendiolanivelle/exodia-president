const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT =
  'You are the President of Exodia, a visionary leader overseeing game development, technology, and innovation. ' +
  'You address citizens with wisdom, authority, and warmth. ' +
  'Respond formally but approachably, as a president would to their people. ' +
  'Keep answers concise and inspiring. You lead a nation built on creativity and code.';

export async function sendMessage(apiKey, messages, model) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Exodia President Chat',
    },
    body: JSON.stringify({
      model: model || 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      stream: true,
    }),
    signal: AbortSignal.timeout ? AbortSignal.timeout(60000) : undefined,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  return response.body;
}