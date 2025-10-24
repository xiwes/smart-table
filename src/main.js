import './fonts/ys-display/fonts.css';
import './style.css';

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// Инициализация таблицы и обработчика действий
const sampleTable = initTable({
  tableTemplate: 'table',
  rowTemplate: 'row',
  // эти подшаблоны реально используются ниже
  before: ['search', 'header', 'filter'],
  after: ['pagination'],
}, (actionEl) => {
  const action = actionEl
    ? { name: actionEl.getAttribute('name') || actionEl.dataset.action, dataset: actionEl.dataset }
    : undefined;
  render(action);
});

// смонтировать на страницу
document.getElementById('app').append(sampleTable.container);

// API (серверный режим)
const api = initData();

// Сбор текущего состояния формы/контролов таблицы
const collectState = () => processFormData(new FormData(sampleTable.container));

// Компоненты
const { applyPagination, updatePagination } = initPagination(sampleTable.pagination.elements);
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const applySearching = initSearching('search');
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

async function render(action) {
    const state = collectState();
    let query = {};

    // Собираем параметры запроса к серверу
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Получаем данные и отрисовываем
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

async function init() {
    // запрашиваем индексы и наполняем селекты фильтра
    const indexes = await api.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

// Запускаем
init().then(() => render());
