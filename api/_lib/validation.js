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
