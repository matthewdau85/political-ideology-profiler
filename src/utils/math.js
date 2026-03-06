export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function euclideanDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function normalize(value, min, max, newMin = -10, newMax = 10) {
  if (max === min) return (newMin + newMax) / 2;
  return newMin + ((value - min) / (max - min)) * (newMax - newMin);
}

export function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export function standardDeviation(arr) {
  if (arr.length < 2) return 0;
  const avg = average(arr);
  const variance = arr.reduce((s, v) => s + (v - avg) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function generateId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function percentOverlap(a, b, dimensions) {
  let totalDist = 0;
  for (const dim of dimensions) {
    totalDist += Math.abs(a[dim] - b[dim]);
  }
  const maxDist = dimensions.length * 20; // range is -10 to +10 = 20
  return Math.max(0, Math.round((1 - totalDist / maxDist) * 100));
}
