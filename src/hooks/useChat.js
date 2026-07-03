import { useState, useCallback, useRef } from 'react';
import { sendMessage } from '../lib/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const clearError = useCallback(() => setError(null), []);

  const send = useCallback(
    async (content) => {
      if (!content.trim()) return;

      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      const assistantId = (Date.now() + 1).toString();
      const assistantMsg = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      const updated = [...messages, userMsg, assistantMsg];
      setMessages(updated);
      setIsStreaming(true);
      setError(null);

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const apiMessages = updated
          .filter((m) => m.role !== 'assistant' || m.content)
          .map((m) => ({ role: m.role, content: m.content }));
        const cleanMessages = apiMessages.slice(0, -1);

        const body = await sendMessage(cleanMessages);
        const reader = body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m,
                  ),
                );
              }
            } catch {
              // skip malformed chunk
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m,
          ),
        );
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: 'An error occurred. Please try again.',
                  }
                : m,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages],
  );

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
    setError(null);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    isStreaming,
    error,
    send,
    clearChat,
    stopStreaming,
    clearError,
  };
}