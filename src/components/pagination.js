import {getPages} from "../lib/utils.js";

let pageCount;

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
                case 'prev': page = Math.max(1, page - 1); break;
                case 'next': page = page + 1; break; // ограничим после получения total
                case 'first': page = 1; break;
                case 'last': page = pageCount || 1; break;
                case 'goto': {
                    const value = Number(action.dataset?.page);
                    if (!Number.isNaN(value)) page = value;
                    break;
                }
            }
        }

        return Object.assign({}, query, { limit, page });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.max(1, Math.ceil(total / limit));

        page = Math.min(Math.max(1, Number(page) || 1), pageCount);

        const visible = getPages(page, pageCount, 5);
        pages.replaceChildren(...visible.map(num => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.action = 'goto';
            btn.dataset.page = String(num);
            btn.textContent = String(num);
            if (num === page) btn.disabled = true;
            return btn;
        }));

        if (prev) prev.disabled = page <= 1;
        if (first) first.disabled = page <= 1;
        if (next) next.disabled = page >= pageCount;
        if (last) last.disabled = page >= pageCount;
        if (rowsPerPage && 'value' in rowsPerPage) rowsPerPage.value = String(limit);
    };

    return {
        updatePagination,
        applyPagination
    };
}
