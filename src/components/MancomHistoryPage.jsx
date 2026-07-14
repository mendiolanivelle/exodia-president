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

export default function MancomHistoryPage() {
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
            Scheduled every 2nd Tuesday of the month. Started January 2026.
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
                    <tr
                      key={m.num}
                      className="border-t border-surface-border hover:bg-surface-input transition-colors"
                    >
                      <td className="px-4 py-3 text-zinc-400 font-mono text-xs">
                        {String(m.num).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-zinc-200 font-medium">
                        {m.date}
                      </td>
                      <td className="px-4 py-3">
                        {statusBadge(m.status)}
                      </td>
                    </tr>
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