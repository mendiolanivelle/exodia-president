import { useState, useEffect } from 'react';
import { HiOutlineChevronDown, HiOutlineChevronRight, HiOutlineSave } from 'react-icons/hi';
import { supabase } from '../lib/supabase';

const departments = [
  'Operations',
  'IT',
  'Facility',
  'Finance',
  'Human Resource',
  'Marketing',
  'Sales',
];

function getSecondTuesdays(startYear, startMonth, endYear, endMonth) {
  const dates = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = firstDay.getDay();
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
    const secondTuesday = 7 + daysUntilTuesday + 1;
    dates.push(new Date(year, month - 1, secondTuesday));
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return dates;
}

const meetings = getSecondTuesdays(2026, 1, 2026, 7).map((date, i) => {
  const num = i + 1;
  const monthIndex = date.getMonth();
  const quarter = Math.floor(monthIndex / 3) + 1;
  const formatted = date.toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = date <= today;
  const isToday = date.getTime() === today.getTime();

  return {
    num,
    quarter,
    date: formatted,
    status: isToday ? 'Today' : isPast ? 'Completed' : 'Upcoming',
    isPast,
  };
});

const quarters = {};
for (const m of meetings) {
  const q = `Q${m.quarter} 2026`;
  if (!quarters[q]) quarters[q] = [];
  quarters[q].push(m);
}

const quarterLabels = {
  'Q1 2026': 'First Quarter',
  'Q2 2026': 'Second Quarter',
  'Q3 2026': 'Third Quarter',
  'Q4 2026': 'Fourth Quarter',
};

const statusBadge = (status) => {
  const colors = {
    Completed: 'bg-green-500/10 text-green-400 border border-green-500/30',
    Today: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30',
    Upcoming: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30',
  };
  const dots = {
    Completed: 'bg-green-400',
    Today: 'bg-brand-orange',
    Upcoming: 'bg-zinc-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
};

const inputClass = 'w-full rounded-lg border border-surface-border bg-surface-input px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand-orange';

function MeetingRow({ meeting, isExpanded, onToggle, pptLinks, onSave }) {
  const [form, setForm] = useState(() => {
    const saved = pptLinks[meeting.num] || {};
    const init = {};
    for (const dept of departments) {
      init[dept] = saved[dept] || '';
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = pptLinks[meeting.num] || {};
    const init = {};
    for (const dept of departments) {
      init[dept] = saved[dept] || '';
    }
    setForm(init);
  }, [pptLinks, meeting.num]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(meeting.num, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  const isEditable = meeting.status === 'Today';
  const isViewable = meeting.status === 'Completed' || meeting.status === 'Today';

  return (
    <>
      <tr
        onClick={isViewable ? onToggle : undefined}
        className={`border-t border-surface-border transition-colors ${
          isViewable ? 'cursor-pointer hover:bg-surface-input' : ''
        } ${isExpanded ? 'bg-surface-input/50' : ''}`}
      >
        <td className="px-4 py-3 text-zinc-400 font-mono text-xs">
          {String(meeting.num).padStart(2, '0')}
        </td>
        <td className="px-4 py-3 text-zinc-200 font-medium flex items-center gap-2">
          {meeting.date}
          {isViewable && (
            isExpanded
              ? <HiOutlineChevronDown className="w-4 h-4 text-zinc-500" />
              : <HiOutlineChevronRight className="w-4 h-4 text-zinc-500" />
          )}
        </td>
        <td className="px-4 py-3">
          {statusBadge(meeting.status)}
        </td>
      </tr>
      {isExpanded && isViewable && (
        <tr>
          <td colSpan={3} className="px-4 py-4 bg-surface-input/30">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <div key={dept}>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                    {dept}
                  </label>
                  <input
                    type="text"
                    value={form[dept]}
                    onChange={(e) => setForm({ ...form, [dept]: e.target.value })}
                    placeholder="PPT link..."
                    className={inputClass}
                    disabled={!isEditable}
                  />
                </div>
              ))}
            </div>
            {isEditable && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-hover transition-colors disabled:opacity-50"
                >
                  <HiOutlineSave className="w-4 h-4" />
                  {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function MancomHistoryPage() {
  const [pptLinks, setPptLinks] = useState({});
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('mancom_ppts')
        .select('meeting_num, links');

      if (error) {
        console.error('Failed to load PPT links:', error.message);
      }

      const map = {};
      if (data) {
        for (const row of data) {
          map[row.meeting_num] = row.links;
        }
      }
      setPptLinks(map);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = (num) => {
    setExpandedMeeting((prev) => (prev === num ? null : num));
  };

  const handleSave = async (num, links) => {
    const { data: current } = await supabase
      .from('mancom_ppts')
      .select('links')
      .eq('meeting_num', num)
      .single();

    const merged = { ...(current?.links || {}), ...links };

    const { error } = await supabase
      .from('mancom_ppts')
      .upsert({ meeting_num: num, links: merged, updated_at: new Date().toISOString() }, { onConflict: 'meeting_num' });

    if (error) throw error;

    setPptLinks((prev) => ({ ...prev, [num]: merged }));
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-surface-dark">
        <div className="border-b border-surface-border px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <div className="h-3 w-36 bg-surface-input rounded animate-pulse" />
            <div className="h-6 w-48 bg-surface-input rounded animate-pulse mt-2" />
            <div className="h-4 w-72 bg-surface-input rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
          <div className="h-64 bg-surface-input rounded animate-pulse" />
          <div className="h-64 bg-surface-input rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
            Management Committee
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">
            Mancom History
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Scheduled every 2nd Tuesday of the month. Click a completed meeting to manage department PPT links.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {Object.entries(quarters).map(([quarter, items]) => (
          <section key={quarter}>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-brand-orange-light border border-brand-orange/30 text-xs font-semibold text-brand-orange uppercase tracking-wider">
                {quarter}
              </span>
              <span className="text-sm text-zinc-400">
                {quarterLabels[quarter]}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-surface-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-input">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-surface-border w-16">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-surface-border">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-surface-border w-32">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => (
                    <MeetingRow
                      key={m.num}
                      meeting={m}
                      isExpanded={expandedMeeting === m.num}
                      onToggle={() => handleToggle(m.num)}
                      pptLinks={pptLinks}
                      onSave={handleSave}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}