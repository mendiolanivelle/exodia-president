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

function ErrorState({ message, debug }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface-dark px-4">
      <div className="text-center max-w-lg">
        <div className="w-14 h-14 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-400 text-xl font-bold mx-auto mb-4">
          !
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Unable to load document</h2>
        <div className="rounded-lg bg-red-950/50 border border-red-800 p-4 mt-4 text-left">
          <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">Server Error</p>
          <p className="text-sm text-red-200 font-mono break-all">{message}</p>
        </div>
        {debug && (
          <div className="rounded-lg bg-surface-input border border-surface-border p-4 mt-4 text-left">
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Key Diagnostics</p>
            <pre className="text-xs text-zinc-300 font-mono leading-relaxed">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </div>
        )}
        <p className="text-xs text-zinc-500 mt-4">
          Verify GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DOC_ID are set in Coolify.
          Make sure the service account has Viewer access to the Google Doc.
        </p>
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
  const [debug, setDebug] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await fetch('/api/doc');
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || `Server error: ${r.status}`);
        }
        const data = await r.json();
        if (!cancelled) setDoc(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load document.');
        try {
          const dr = await fetch('/api/debug');
          const dd = await dr.json();
          if (!cancelled) setDebug(dd);
        } catch {
          // ignore
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} debug={debug} />;

  const hasTabs = doc.tabs && doc.tabs.length > 0;
  const currentContent = hasTabs
    ? doc.tabs[activeTab]?.sections || []
    : doc.sections;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3 shrink-0">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
            Management Committee Meeting
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">
            {doc.title}
          </h1>
        </div>
      </div>

      {hasTabs && (
        <div className="border-b border-surface-border shrink-0">
          <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
            {doc.tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === i
                    ? 'bg-brand-orange text-white'
                    : 'text-zinc-400 hover:bg-surface-input hover:text-white'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {hasTabs && (
          <div className="max-w-5xl mx-auto px-4 pt-2">
            <h2 className="text-xl font-semibold text-brand-orange mt-4 mb-4">
              {doc.tabs[activeTab]?.title}
            </h2>
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-2">
          {currentContent.map((section, i) => (
            <DocSection key={i} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}