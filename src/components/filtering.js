import {createComparison, defaultRules} from "../lib/compare.js";

// Настроим компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const selectEl = elements[elementName];
        if (!selectEl) return;
        const opts = Object.values(indexes[elementName]).map(name => {
            const opt = document.createElement('option');
            opt.value = String(name);
            opt.textContent = String(name);
            return opt;
        });
        selectEl.append(...opts);
    });

    return (data, state, action) => {
        // Обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            // Попробуем найти input рядом с кнопкой
            const wrapper = action.closest('.filter-wrapper');
            const input = wrapper ? wrapper.querySelector('input') : null;
            if (input) input.value = '';
            if (field in state) state[field] = '';
        }

        // Отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}