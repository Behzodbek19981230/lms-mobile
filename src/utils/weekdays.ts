const weekdayMap: Record<string, string> = {
  monday: 'Dushanba',
  tuesday: 'Seshanba',
  wednesday: 'Chorshanba',
  thursday: 'Payshanba',
  friday: 'Juma',
  saturday: 'Shanba',
  sunday: 'Yakshanba',

  dushanba: 'Dushanba',
  seshanba: 'Seshanba',
  chorshanba: 'Chorshanba',
  payshanba: 'Payshanba',
  juma: 'Juma',
  shanba: 'Shanba',
  yakshanba: 'Yakshanba',
};

export function formatWeekday(raw: unknown): string {
  const key = String(raw || '').trim().toLowerCase();
  return weekdayMap[key] || String(raw || '').trim();
}

export function formatWeekdays(days: unknown): string {
  if (!Array.isArray(days)) return '';
  return days.map(formatWeekday).filter(Boolean).join(', ');
}
