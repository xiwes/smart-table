export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const selectEl = elements[elementName];
      if (!selectEl) return;

      const prev = selectEl.value;

      while (selectEl.options.length > 1) {
        selectEl.remove(1);
      }

      const opts = Object.values(indexes[elementName]).map((name) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        return opt;
      });
      selectEl.append(...opts);

      if (prev && opts.some(o => o.value === prev)) {
        selectEl.value = prev;
      } else {
        selectEl.value = '';
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action?.name === 'clear' && action.dataset?.field) {
      const field = action.dataset.field;
      const el = Object.values(elements).find(el => el?.name === field);
      if (el) el.value = '';
    }

    const filter = {};
    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;
      if (['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return { updateIndexes, applyFiltering };
}
