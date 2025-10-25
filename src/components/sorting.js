import { sortMap } from '../lib/sort.js';

export function initSorting(columns) {
  return (query, state, action) => {
    if (!action || !action.dataset) return query;

    const field = action.dataset.field;
    if (!field) return query;

    action.dataset.value = sortMap[action.dataset.value];
    const order = action.dataset.value; // 'asc' | 'desc' | 'none'

    const sort = (order === 'asc' || order === 'desc')
      ? `${field}:${order}`
      : null;

    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
