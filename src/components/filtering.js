export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const selectEl = elements[elementName];
            if (!selectEl) return;
            // очистим старые
            selectEl.replaceChildren();
            Object.values(indexes[elementName]).forEach(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                selectEl.appendChild(el);
            });
        });
    };

    const applyFiltering = (query, state, action) => {
        // очистка отдельного поля по кнопке в UI (опционально)
        if (action && action.name === 'clear' && action.dataset?.field) {
            const fieldName = action.dataset.field;
            const input = elements[fieldName];
            if (input && 'value' in input) input.value = '';
            if (fieldName in state) state[fieldName] = '';
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (!el) return;
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}
