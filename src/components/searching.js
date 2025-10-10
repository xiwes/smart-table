import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // Настроить компаратор: пропускать пустые значения цели и искать по нескольким полям
    const compare = createComparison(['skipEmptyTargetValues'], [
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);

    return (data, state, action) => {
        // Применить компаратор для поиска
        return data.filter(row => compare(row, state));
    }
}