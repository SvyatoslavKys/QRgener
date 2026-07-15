const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeEntry = (entry, index) => {
  if (typeof entry === "string") {
    return {
      id: `legacy-${index}-${entry}`,
      value: entry,
      createdAt: null,
    };
  }

  if (entry && typeof entry.value === "string") {
    return {
      id: entry.id || `saved-${index}-${entry.value}`,
      value: entry.value,
      createdAt: entry.createdAt || null,
    };
  }

  return null;
};

export const readHistory = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored)
      ? stored.map(normalizeEntry).filter(Boolean).reverse()
      : [];
  } catch {
    return [];
  }
};

export const appendHistory = (key, value) => {
  const cleanValue = value.trim();
  if (!cleanValue) return;

  let stored = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    stored = Array.isArray(parsed) ? parsed : [];
  } catch {
    stored = [];
  }

  stored.push({
    id: createId(),
    value: cleanValue,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(key, JSON.stringify(stored.slice(-100)));
};

export const removeHistoryEntry = (key, id) => {
  const current = readHistory(key).filter((entry) => entry.id !== id).reverse();
  localStorage.setItem(key, JSON.stringify(current));
};

export const clearHistory = (key) => {
  localStorage.removeItem(key);
};
