import { getPages } from '../lib/utils.js';

let pageCount = 1;

export function initPagination(elements) {
  const {
    pages,
    previousPage: prev,
    nextPage: next,
    firstPage: first,
    lastPage: last,
    rowsPerPage
  } = elements;

  const applyPagination = (query, state, action) => {
    const limit = Number(state.rowsPerPage) || 10;
    let page = Number(state.page) || 1;

    if (action && action.name) {
      switch (action.name) {
        case 'prev':  page = Math.max(1, page - 1); break;
        case 'next':  page = page + 1; break;
        case 'first': page = 1; break;
        case 'last':  page = pageCount || 1; break;
        // при клике по номеру страницы state.page уже обновится радиокнопкой
      }
    }

    return Object.assign({}, query, { limit, page });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.max(1, Math.ceil(total / limit));
    page = Math.min(Math.max(1, Number(page) || 1), pageCount);

    const visible = getPages(page, pageCount, 5);
    pages.replaceChildren(...visible.map((num) => {
      const label = document.createElement('label');
      label.className = 'pagination-button';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'page';
      input.value = String(num);
      if (num === page) input.checked = true;

      const span = document.createElement('span');
      span.textContent = String(num);

      label.append(input, span);
      return label;
    }));

    // состояния стрелок
    if (prev)  prev.disabled  = page <= 1;
    if (first) first.disabled = page <= 1;
    if (next)  next.disabled  = page >= pageCount;
    if (last)  last.disabled  = page >= pageCount;

    if (rowsPerPage && 'value' in rowsPerPage) {
      rowsPerPage.value = String(limit);
    }
  };

  return { updatePagination, applyPagination };
}
