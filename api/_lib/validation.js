export function hasUnexpectedKeys(value, allowedKeys = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  const allowed = new Set(allowedKeys);
  return Object.keys(value).filter((key) => !allowed.has(key));
}

export function rejectUnexpectedKeys(res, value, allowedKeys = []) {
  const unexpected = hasUnexpectedKeys(value, allowedKeys);
  if (!unexpected.length) return false;
  res.status(400).json({
    error: 'Unexpected request fields',
    fields: unexpected,
  });
  return true;
}

export function inRangeNumber(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max;
}

export function isValidEmail(value) {
  if (!value || typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length < 3 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}
