export async function sendMessage(messages, options = {}) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, ...options }),
    signal: AbortSignal.timeout ? AbortSignal.timeout(120000) : undefined,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || err.message || `Server error: ${response.status}`);
  }

  return response.body;
}
