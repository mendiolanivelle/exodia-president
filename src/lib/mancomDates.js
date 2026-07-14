function computeSecondTuesdays(startYear, startMonth, endYear, endMonth) {
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

export function getMancomDates() {
  try {
    const saved = localStorage.getItem('mancom-cron');
    if (saved) {
      const config = JSON.parse(saved);
      if (config.dates && config.dates.length > 0) {
        return config.dates.map((d) => new Date(d + 'T00:00:00'));
      }
    }
  } catch { /* ignore */ }
  return computeSecondTuesdays(2026, 1, 2026, 12);
}

export function getDefaultDates() {
  return computeSecondTuesdays(2026, 1, 2026, 12).map((d) => d.toISOString().slice(0, 10));
}