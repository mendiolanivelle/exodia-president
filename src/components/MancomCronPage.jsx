import { useState } from 'react';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineSave } from 'react-icons/hi';

function getSecondTuesdays() {
  const dates = [];
  for (let month = 1; month <= 12; month++) {
    const firstDay = new Date(2026, month - 1, 1);
    const dayOfWeek = firstDay.getDay();
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
    const secondTuesday = 7 + daysUntilTuesday + 1;
    const d = new Date(2026, month - 1, secondTuesday);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function loadConfig() {
  try {
    const saved = localStorage.getItem('mancom-cron');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    emails: [],
    dates: getSecondTuesdays(),
    upcomingTemplate: {
      subject: 'Upcoming Mancom Meeting — {{date}}',
      body: 'Dear team,\n\nThis is a reminder that the Management Committee Meeting will be held on {{date}}.\n\nPlease prepare your department updates.\n\nBest regards,\nMancom Secretariat',
    },
    followUpTemplate: {
      subject: 'Mancom Follow-up — {{date}}',
      body: 'Dear team,\n\nFollowing up on the Mancom meeting held on {{date}}. Please submit your action items by end of week.\n\nThank you,\nMancom Secretariat',
    },
  };
}

function saveConfig(config) {
  localStorage.setItem('mancom-cron', JSON.stringify(config));
}

export default function MancomCronPage() {
  const [config, setConfig] = useState(loadConfig);
  const [emailInput, setEmailInput] = useState('');
  const [saved, setSaved] = useState(false);

  const addEmail = () => {
    const email = emailInput.trim();
    if (!email || !email.includes('@') || config.emails.includes(email)) return;
    const next = { ...config, emails: [...config.emails, email] };
    setConfig(next);
    setEmailInput('');
  };

  const removeEmail = (email) => {
    const next = { ...config, emails: config.emails.filter((e) => e !== email) };
    setConfig(next);
  };

  const updateDate = (i, value) => {
    const dates = [...config.dates];
    dates[i] = value;
    setConfig({ ...config, dates });
  };

  const updateTemplate = (key, field, value) => {
    setConfig({
      ...config,
      [key]: { ...config[key], [field]: value },
    });
  };

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const labelClass = 'block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5';
  const inputClass = 'w-full rounded-lg border border-surface-border bg-surface-input px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand-orange';

  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
              Management Committee
            </p>
            <h1 className="text-2xl font-bold text-white mt-1">
              Cron Job Automation
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Configure email recipients, meeting dates, and message templates for automated Mancom notifications.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-hover transition-colors"
          >
            <HiOutlineSave className="w-4 h-4" />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Email Recipients</h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEmail()}
              placeholder="Enter email address..."
              className={inputClass}
            />
            <button
              onClick={addEmail}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-hover transition-colors"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Add
            </button>
          </div>
          {config.emails.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {config.emails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-input border border-surface-border text-sm text-zinc-300"
                >
                  {email}
                  <button
                    onClick={() => removeEmail(email)}
                    className="p-0.5 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 mt-4">No recipients added yet.</p>
          )}
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Mancom Dates (2026)</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {config.dates.map((date, i) => {
              const monthName = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long' });
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-10 shrink-0">{monthName.slice(0, 3)}</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => updateDate(i, e.target.value)}
                    className="flex-1 rounded-lg border border-surface-border bg-surface-input px-3 py-2 text-sm text-white outline-none focus:border-brand-orange"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-1">
            Template 1 — Upcoming Mancom
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Sent before the meeting. Use <code className="text-brand-orange">{'{{date}}'}</code> as placeholder for the meeting date.
          </p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Subject</label>
              <input
                type="text"
                value={config.upcomingTemplate.subject}
                onChange={(e) => updateTemplate('upcomingTemplate', 'subject', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Body</label>
              <textarea
                value={config.upcomingTemplate.body}
                onChange={(e) => updateTemplate('upcomingTemplate', 'body', e.target.value)}
                rows={6}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-1">
            Template 2 — Follow-up
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Sent after the meeting. Use <code className="text-brand-orange">{'{{date}}'}</code> as placeholder for the meeting date.
          </p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Subject</label>
              <input
                type="text"
                value={config.followUpTemplate.subject}
                onChange={(e) => updateTemplate('followUpTemplate', 'subject', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Body</label>
              <textarea
                value={config.followUpTemplate.body}
                onChange={(e) => updateTemplate('followUpTemplate', 'body', e.target.value)}
                rows={6}
                className={inputClass}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}