import { useState } from 'react';
import { sendMessage } from '../lib/api';

const sampleText = `Q: Isn't it true that the defendant admitted the debt to your secretary?
A: My secretary told me he said he would pay soon.
Q: What did the contract say about penalties?
Q: You probably knew the invoice was fake, correct?`;

async function readStreamingResponse(body, onText) {
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

export default function ObjectionAssistantPage() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const body = await sendMessage(
        [
          {
            role: 'user',
            content: `Analyze this material and prompt possible objections under the Philippine Rules of Court:\n\n${text.trim()}`,
          },
        ],
        { mode: 'objections' },
      );

      await readStreamingResponse(body, setOutput);
    } catch (err) {
      setError(err.message || 'Unable to analyze the input.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
            Philippine Rules of Court
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">
            Objection Assistant
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-3xl">
            Paste transcript lines, affidavit text, draft questions, or exhibit descriptions. OpenRouter will analyze the input and return possible objections for attorney review.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Input</h2>
            <button
              type="button"
              onClick={() => setText(sampleText)}
              className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-zinc-300 hover:bg-surface-input hover:text-white transition-colors"
            >
              Load Sample
            </button>
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste lines, questions, testimony, affidavit paragraphs, or document descriptions here..."
            className="mt-4 h-[460px] w-full resize-none rounded-lg border border-surface-border bg-surface-input p-4 text-sm leading-relaxed text-white outline-none placeholder:text-zinc-500 focus:border-brand-orange"
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className="mt-4 w-full rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? 'Analyzing with OpenRouter...' : 'Analyze Objections'}
          </button>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">AI Output</h2>

          {error && (
            <div className="mt-4 rounded-lg border border-red-800 bg-red-950/70 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {!output && !error ? (
            <div className="mt-4 rounded-lg border border-surface-border bg-surface-input p-4 text-sm text-zinc-400">
              The analysis will appear here. Outputs are prompts for counsel and should be verified against the current Rules of Court, case context, purpose of offer, exceptions, waiver, and court instructions.
            </div>
          ) : (
            <div className="mt-4 min-h-[520px] whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-input p-4 text-sm leading-relaxed text-zinc-200">
              {output}
            </div>
          )}
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Attorney Review Checklist</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              'Confirm the purpose for which the evidence is offered.',
              'Check whether an exception, waiver, stipulation, or admission applies.',
              'Match the objection to timing: question, answer, formal offer, or written offer.',
              'Keep the courtroom phrasing short and preserve the detailed reasoning for argument.',
              'Verify current rules, special proceedings, and judge-specific instructions.',
              'Treat every output as a prompt for counsel, not a final legal conclusion.',
            ].map((item) => (
              <div key={item} className="rounded-lg border border-surface-border bg-surface-input p-3 text-sm text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
