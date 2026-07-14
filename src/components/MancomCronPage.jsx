import { useState, useEffect, useRef } from 'react';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import { getDefaultDates } from '../lib/mancomDates';

const defaultConfig = {
  emails: [],
  dates: getDefaultDates(),
  daysBefore: 3,
  upcomingTemplate: {
    subject: 'Upcoming Mancom Meeting — {{date}}',
    body: 'Dear team,\n\nThis is a reminder that the Management Committee Meeting will be held on {{date}}.\n\nPlease prepare your department updates.\n\nBest regards,\nMancom Secretariat',
  },
  followUpTemplate: {
    subject: 'Mancom Follow-up — {{date}}',
    body: 'Dear team,\n\nFollowing up on the Mancom meeting held on {{date}}. Please submit your action items by end of week.\n\nThank you,\nMancom Secretariat',
  },
};

export default function MancomCronPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [emailInput, setEmailInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef(false);
  const saveTimerRef = useRef(null);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('mancom_cron')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setConfig({
          emails: data.emails || [],
          dates: (data.dates && data.dates.length > 0) ? data.dates : getDefaultDates(),
          daysBefore: data.days_before ?? 3,
          upcomingTemplate: data.upcoming_template?.subject
            ? data.upcoming_template
            : defaultConfig.upcomingTemplate,
          followUpTemplate: data.follow_up_template?.subject
            ? data.follow_up_template
            : defaultConfig.followUpTemplate,
        });
      }
      loadedRef.current = true;
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    clearTimeout(saveTimerRef.current);
saveTimerRef.current = setTimeout(() => {
      saveNow(config.emails, config.dates, config.daysBefore, config.upcomingTemplate, config.followUpTemplate);
    }, 800);
    return () => clearTimeout(saveTimerRef.current);
  }, [config]);

  const saveNow = async (emails, dates, daysBefore, upcomingTemplate, followUpTemplate) => {
    const { error } = await supabase
      .from('mancom_cron')
      .upsert({
        id: 1,
        emails,
        dates,
        days_before: daysBefore,
        upcoming_template: upcomingTemplate,
        follow_up_template: followUpTemplate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  const addEmail = () => {
    const email = emailInput.trim();
    if (!email || !email.includes('@') || config.emails.includes(email)) return;
    const emails = [...config.emails, email];
    setConfig((prev) => ({ ...prev, emails }));
    setEmailInput('');
    clearTimeout(saveTimerRef.current);
    saveNow(emails, config.dates, config.upcomingTemplate, config.followUpTemplate);
  };

  const removeEmail = (email) => {
    const emails = config.emails.filter((e) => e !== email);
    setConfig((prev) => ({ ...prev, emails }));
    clearTimeout(saveTimerRef.current);
    saveNow(emails, config.dates, config.upcomingTemplate, config.followUpTemplate);
  };

  const updateDate = (i, value) => {
    const dates = [...config.dates];
    dates[i] = value;
    setConfig((prev) => ({ ...prev, dates }));
  };

  const saveDate = () => {
    clearTimeout(saveTimerRef.current);
    const c = configRef.current;
    saveNow(c.emails, c.dates, c.daysBefore, c.upcomingTemplate, c.followUpTemplate);
  };

  const updateTemplate = (key, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const labelClass = 'block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5';
  const inputClass = 'w-full rounded-lg border border-surface-border bg-surface-input px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand-orange';

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-surface-dark">
        <div className="border-b border-surface-border px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="h-3 w-36 bg-surface-input rounded animate-pulse" />
            <div className="h-6 w-48 bg-surface-input rounded animate-pulse mt-2" />
            <div className="h-4 w-72 bg-surface-input rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <div className="h-40 bg-surface-input rounded animate-pulse" />
          <div className="h-60 bg-surface-input rounded animate-pulse" />
          <div className="h-48 bg-surface-input rounded animate-pulse" />
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-zinc-400">
                Changes save automatically.
              </p>
              <span className={`text-xs transition-all duration-300 ${saved ? 'text-green-400 opacity-100' : 'opacity-0'}`}>
                Saved
              </span>
            </div>
          </div>
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
                    onBlur={saveDate}
                    className="flex-1 rounded-lg border border-surface-border bg-surface-input px-3 py-2 text-sm text-white outline-none focus:border-brand-orange"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Days Setting</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Mancom meetings become <span className="text-brand-orange">Open</span> for editing this many days before the date. After the meeting date, they are marked <span className="text-green-400">Completed</span>.
          </p>
          <div className="max-w-xs">
            <label className={labelClass}>Days Before</label>
            <p className="text-xs text-zinc-500 mb-2">Meeting becomes editable this many days before the date.</p>
            <input
              type="number"
              min="0"
              value={config.daysBefore}
              onChange={(e) => setConfig((prev) => ({ ...prev, daysBefore: parseInt(e.target.value) || 0 }))}
              className={inputClass}
            />
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