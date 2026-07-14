import { useState, useEffect } from 'react';

function LoadingSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-pulse">
        <div className="h-8 w-2/3 bg-surface-input rounded" />
        <div className="h-4 w-full bg-surface-input rounded" />
        <div className="h-4 w-5/6 bg-surface-input rounded" />
        <div className="h-6 w-1/3 bg-surface-input rounded mt-8" />
        <div className="h-4 w-full bg-surface-input rounded" />
        <div className="h-4 w-4/5 bg-surface-input rounded" />
        <div className="h-4 w-3/4 bg-surface-input rounded" />
        <div className="h-6 w-2/5 bg-surface-input rounded mt-8" />
        <div className="h-4 w-full bg-surface-input rounded" />
        <div className="h-4 w-5/6 bg-surface-input rounded" />
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface-dark px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-400 text-xl font-bold mx-auto mb-4">
          !
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Unable to load document</h2>
        <p className="text-sm text-zinc-400">{message}</p>
      </div>
    </div>
  );
}

function DocSection({ section }) {
  switch (section.type) {
    case 'h1':
      return (
        <h1 className="text-3xl font-bold text-white border-b border-surface-border pb-3 mb-6 mt-6">
          {section.text}
        </h1>
      );
    case 'h2':
      return (
        <h2 className="text-xl font-semibold text-brand-orange mt-8 mb-3">
          {section.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="text-lg font-medium text-white mt-6 mb-2">
          {section.text}
        </h3>
      );
    case 'p':
      return (
        <p className="text-sm leading-relaxed text-zinc-300 mb-4">
          {section.text}
        </p>
      );
    case 'bullet':
      return (
        <div className="flex gap-3 mb-2 text-sm text-zinc-300">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
          <span>{section.text}</span>
        </div>
      );
    case 'table':
      return (
        <div className="mb-6 overflow-x-auto rounded-lg border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-input">
                {(section.rows[0] || []).map((cell, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-surface-border"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.slice(1).map((row, ri) => (
                <tr
                  key={ri}
                  className="border-t border-surface-border hover:bg-surface-input transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-zinc-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'break':
      return <div className="h-4" />;
    default:
      return null;
  }
}

export default function DocPage() {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/doc')
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setDoc(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load document.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
            Legal Guide
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">
            {doc.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {doc.sections.map((section, i) => (
          <DocSection key={i} section={section} />
        ))}
      </div>
    </div>
  );
}