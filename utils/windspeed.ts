const between = function (n: number, a: number, b: number, inclusive: boolean = true) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return inclusive ? n >= min && n <= max : n > min && n < max;
}

export function getWindDescription(ms: number) {
  if (ms < 0.2) return 'Stille vind';
  if (between(ms, 0.3, 1.5)) return 'Flau vind';
  if (between(ms, 1.6, 3.3)) return 'Svak vind';
  if (between(ms, 3.4, 5.4)) return 'Lett bris';
  if (between(ms, 5.5, 7.9)) return 'Laber bris';
  if (between(ms, 8.0, 10.7)) return 'Frisk bris';
  if (between(ms, 10.8, 13.8)) return 'Liten kuling';
  if (between(ms, 13.9, 17.1)) return 'Stiv kuling';
  if (between(ms, 17.2, 20.7)) return 'Sterk kuling';
  if (between(ms, 20.8, 24.4)) return 'Liten storm';
  if (between(ms, 24.5, 28.4)) return 'Full storm';
  if (between(ms, 28.5, 32.6)) return 'Sterk storm';
  if (ms > 32.6) return 'Orkan';
}
