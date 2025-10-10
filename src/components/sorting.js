import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // Запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            // Сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column !== action && column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Получить выбранный режим сортировки
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        return sortCollection(data, field, order);
    }
}