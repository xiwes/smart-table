import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: function}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // Добавим дополнительные шаблоны до и после таблицы
    if (Array.isArray(before) && before.length) {
        before.slice().reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.prepend(root[subName].container);
        });
    }
    if (Array.isArray(after) && after.length) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.append(root[subName].container);
        });
    }

    // Обработчики событий формы-таблицы
    root.container.addEventListener('change', () => { onAction(); });
    root.container.addEventListener('reset', () => { setTimeout(onAction); });
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // Преобразуем данные в строки по rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    const el = row.elements[key];
                    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
                        el.value = item[key];
                    } else {
                        el.textContent = item[key];
                    }
                }
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}
