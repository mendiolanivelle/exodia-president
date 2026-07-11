import { useMemo, useState } from 'react';

const objectionRules = [
  {
    name: 'Hearsay',
    basis: 'Rule 130, Revised Rules on Evidence',
    trigger: /\b(told me|said that|heard that|according to|informed me|reported that|admitted to him|admitted to her)\b/i,
    phrase: 'Objection, Your Honor. Hearsay.',
    note: 'Check whether the statement is offered for truth, a non-hearsay purpose, or an exception.',
  },
  {
    name: 'Leading question',
    basis: 'Rule 132, examination of witnesses',
    trigger: /\b(isn'?t it true|you would agree|correct\?|right\?|didn'?t you|you saw|you signed|you received)\b/i,
    phrase: 'Objection, Your Honor. Leading.',
    note: 'Usually improper on direct examination, but often allowed on cross or for preliminary matters.',
  },
  {
    name: 'Speculation / no personal knowledge',
    basis: 'Rule 130, testimonial knowledge requirement',
    trigger: /\b(i think|i believe|probably|maybe|must have|could have|seems like|i assume|in my guess)\b/i,
    phrase: 'Objection, Your Honor. Calls for speculation / lack of personal knowledge.',
    note: 'Ask whether the witness personally perceived the fact or is only inferring it.',
  },
  {
    name: 'Assumes facts not in evidence',
    basis: 'Rules 128 and 132, relevance and examination control',
    trigger: /\b(when did you stop|after you stole|because you lied|since you admitted|the forged|the fake)\b/i,
    phrase: 'Objection, Your Honor. Assumes facts not in evidence.',
    note: 'Useful when the question embeds a disputed fact not yet established.',
  },
  {
    name: 'Argumentative',
    basis: 'Rule 132, court control over examination',
    trigger: /\b(you are lying|isn'?t that ridiculous|you expect this court|how convenient|so you want us to believe)\b/i,
    phrase: 'Objection, Your Honor. Argumentative.',
    note: 'Flag questions that argue with the witness instead of asking for facts.',
  },
  {
    name: 'Compound question',
    basis: 'Rule 132, examination of witnesses',
    trigger: /\b(and did you|and whether|and then did|or did you|before and after)\b/i,
    phrase: 'Objection, Your Honor. Compound question.',
    note: 'Ask counsel to break the question into one fact per question.',
  },
  {
    name: 'Best evidence / original document rule',
    basis: 'Rule 130, original document rule',
    trigger: /\b(contract says|document states|email says|text message says|contents of|copy of|screenshot of)\b/i,
    phrase: 'Objection, Your Honor. Best evidence / original document rule.',
    note: 'Use when the contents of a writing, recording, photograph, or electronic document are the subject of inquiry.',
  },
  {
    name: 'Privilege',
    basis: 'Rule 130, privileged communications',
    trigger: /\b(my lawyer told me|attorney advised|doctor told|spouse told|confession to priest|legal advice)\b/i,
    phrase: 'Objection, Your Honor. Privileged communication.',
    note: 'Confirm the relationship, confidentiality, waiver, and any statutory exception.',
  },
  {
    name: 'Authentication / foundation',
    basis: 'Rules 130 and 132, authentication and identification',
    trigger: /\b(photo|screenshot|printout|recording|cctv|email|chat log|document)\b/i,
    phrase: 'Objection, Your Honor. Lack of authentication / foundation.',
    note: 'Check whether a competent witness or proper method links the item to its source.',
  },
  {
    name: 'Vague or ambiguous',
    basis: 'Rule 132, examination of witnesses',
    trigger: /\b(thing|stuff|that matter|it happened|they did it|around that time|some documents)\b/i,
    phrase: 'Objection, Your Honor. Vague and ambiguous.',
    note: 'Use when the witness cannot reasonably know what person, time, act, or document is being asked about.',
  },
];

const sampleText = `Q: Isn't it true that the defendant admitted the debt to your secretary?
A: My secretary told me he said he would pay soon.
Q: What did the contract say about penalties?
Q: You probably knew the invoice was fake, correct?`;

function analyzeText(text) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line, index) =>
      objectionRules
        .filter((rule) => rule.trigger.test(line))
        .map((rule) => ({ line, lineNumber: index + 1, ...rule })),
    );
}

export default function ObjectionAssistantPage() {
  const [text, setText] = useState('');
  const results = useMemo(() => analyzeText(text), [text]);

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
            Paste transcript lines, affidavit text, or exhibit descriptions. The tool flags possible objections for attorney review under the Philippine Rules on Evidence.
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
            className="mt-4 h-[520px] w-full resize-none rounded-lg border border-surface-border bg-surface-input p-4 text-sm leading-relaxed text-white outline-none placeholder:text-zinc-500 focus:border-brand-orange"
          />
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Suggested Objections</h2>
            <span className="rounded-full bg-surface-input px-3 py-1 text-xs text-zinc-400">
              {results.length} flagged
            </span>
          </div>

          {!text.trim() ? (
            <div className="mt-4 rounded-lg border border-surface-border bg-surface-input p-4 text-sm text-zinc-400">
              Add text to begin. This assistant uses rule-based prompts and should be reviewed by counsel before use in court.
            </div>
          ) : results.length === 0 ? (
            <div className="mt-4 rounded-lg border border-surface-border bg-surface-input p-4 text-sm text-zinc-400">
              No obvious objection prompts found. Review manually for relevance, competence, offer, privilege, authentication, and admissibility.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {results.map((result, index) => (
                <article
                  key={`${result.lineNumber}-${result.name}-${index}`}
                  className="rounded-lg border border-surface-border bg-surface-input p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-orange font-semibold">
                        Line {result.lineNumber}
                      </p>
                      <h3 className="mt-1 font-semibold text-white">{result.name}</h3>
                    </div>
                    <span className="rounded-full bg-brand-orange-light px-2 py-1 text-xs text-brand-orange">
                      Review
                    </span>
                  </div>

                  <blockquote className="mt-3 border-l-2 border-brand-orange pl-3 text-sm text-zinc-300">
                    {result.line}
                  </blockquote>

                  <dl className="mt-3 space-y-2 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-zinc-500">Suggested phrasing</dt>
                      <dd className="text-zinc-200">{result.phrase}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-zinc-500">Basis</dt>
                      <dd className="text-zinc-300">{result.basis}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-zinc-500">Attorney note</dt>
                      <dd className="text-zinc-300">{result.note}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Review Checklist</h2>
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
