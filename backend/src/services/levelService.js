export function resolveLevel(consistencyScore) {
  if (consistencyScore < 25) return { level: 1, label: 'Inconsistente' };
  if (consistencyScore < 50) return { level: 2, label: 'Intentando' };
  if (consistencyScore < 80) return { level: 3, label: 'Ejecutor' };
  return { level: 4, label: 'Imparable' };
}

export function scoreFromProfile(streak, penalties) {
  return Math.max(0, Math.min(100, streak * 8 - penalties * 6 + 30));
}
