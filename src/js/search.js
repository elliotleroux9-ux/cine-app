import { searchMovies } from './api.js';
import { debounce } from './utils.js';

const input = document.getElementById('search-input');
const resultsEl = document.getElementById('search-results');
const loadMoreBtn = document.getElementById('load-more-search');

const scrollLeftBtn = document.getElementById('scroll-left-search');
const scrollRightBtn = document.getElementById('scroll-right-search');

if (scrollLeftBtn && resultsEl) {
  scrollLeftBtn.addEventListener('click', () => {
    resultsEl.scrollBy({ left: -400, behavior: 'smooth' });
  });
}
if (scrollRightBtn && resultsEl) {
  scrollRightBtn.addEventListener('click', () => {
    resultsEl.scrollBy({ left: 400, behavior: 'smooth' });
  });
}

let currentQuery = '';
let currentPage = 1;
let totalResults = 0;

async function doSearch(q, page = 1, append = false) {
  if (!resultsEl) return;
  if (!q || q.trim().length < 1) {
    resultsEl.innerHTML = '';
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }
  try {
    const data = await searchMovies(q, page);
    // gérer cas où Search est absent
    if (!data || !Array.isArray(data.Search) || data.Search.length === 0) {
      resultsEl.innerHTML = `<p role="alert">${data?.Error || 'Aucun résultat'}</p>`;
      if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
      return;
    }

    if (!append) resultsEl.innerHTML = '';
    data.Search.forEach(film => resultsEl.appendChild(createResultItem(film)));

    totalResults = parseInt(data.totalResults || '0', 10) || 0;
    const shown = resultsEl.children.length;
    if (loadMoreBtn) {
      if (shown < totalResults) loadMoreBtn.classList.remove('hidden');
      else loadMoreBtn.classList.add('hidden');
    }
  } catch (err) {
    resultsEl.innerHTML = `<p role="alert">Erreur: ${err.message || 'Aucun résultat'}</p>`;
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
  }
}

function createResultItem(film) {
  const a = document.createElement('a');
  a.href = `movie.html?id=${film.imdbID}`;
  a.className = 'card';
  a.innerHTML = `
    <img src="${film.Poster !== 'N/A' ? film.Poster : 'public/no-poster.png'}" alt="Affiche de ${film.Title}">
    <h3>${film.Title}</h3>
    <p>${film.Year}</p>
  `;
  return a;
}

const debounced = debounce((e) => {
  const q = (e.target.value || '').trim();
  currentQuery = q;
  currentPage = 1;
  doSearch(q, 1, false);
}, 300);

if (input) input.addEventListener('input', debounced);

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    doSearch(currentQuery, currentPage, true);
  });
}
