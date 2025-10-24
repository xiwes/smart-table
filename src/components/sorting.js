import {sortMap} from "../lib/sort.js"; // sortCollection больше не нужен

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        const toggle = (cur) => (cur === 'asc' ? 'desc' : (cur === 'desc' ? 'none' : 'asc'));

        if (action && action.name === 'sort' && action.dataset) {
            const column = action;
            const next = toggle(column.dataset.value || 'none');
            // сбросим у остальных
            columns.forEach(c => (c.dataset.value = 'none'));
            column.dataset.value = next;
            field = column.dataset.field;
            order = next;
        } else {
            // восстановление текущего состояния сортировки из DOM
            columns.forEach(column => {
                const val = column.dataset.value || 'none';
                if (val !== 'none') {
                    field = column.dataset.field;
                    order = val;
                }
            });
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null;
        return sort ? Object.assign({}, query, { sort }) : query;
    };
}
