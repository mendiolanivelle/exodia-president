import { supabase } from './supabase';

function computeSecondTuesdays(year) {
  const dates = [];
  for (let month = 1; month <= 12; month++) {
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = firstDay.getDay();
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
    const secondTuesday = 7 + daysUntilTuesday + 1;
    const d = new Date(year, month - 1, secondTuesday);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export async function getMancomDates() {
  try {
    const { data, error } = await supabase
      .from('mancom_cron')
      .select('dates')
      .eq('id', 1)
      .single();

    if (!error && data && data.dates && data.dates.length > 0) {
      return data.dates.map((d) => new Date(d + 'T00:00:00'));
    }
  } catch { /* ignore */ }

  return computeSecondTuesdays(2026).map((d) => new Date(d + 'T00:00:00'));
}

export function getDefaultDates() {
  return computeSecondTuesdays(2026);
}