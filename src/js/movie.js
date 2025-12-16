import { getMovieById } from './api.js';
import { formatDateFR } from './utils.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');

const container = document.getElementById('movie-details');

async function init() {
  if (!id) {
    container.innerHTML = '<p role="alert">Aucun film sélectionné.</p>';
    return;
  }
  try {
    const movie = await getMovieById(id);
    render(movie);
  } catch (err) {
    container.innerHTML = `<p role="alert">Erreur: ${err.message}</p>`;
  }
}

function render(m) {
  container.innerHTML = `
    <div class="movie-header">
      <div class="movie-poster">
        <img src="${m.Poster !== 'N/A' ? m.Poster : '/public/no-poster.png'}" alt="Affiche de ${m.Title}" />
      </div>
      <div class="movie-content">
        <h2>${m.Title} <span class="year">(${m.Year})</span></h2>
        <div class="movie-info">
          <p><span class="label">Genre :</span> ${m.Genre}</p>
          <p><span class="label">Réalisateur :</span> ${m.Director || 'N/A'}</p>
          <p><span class="label">Acteurs :</span> ${m.Actors}</p>
          <p><span class="label">Durée :</span> ${m.Runtime}</p>
          <p><span class="label">Résumé :</span> ${m.Plot}</p>
          <p><span class="label">Notes :</span> ${m.Ratings && m.Ratings.length ? m.Ratings.map(r => `${r.Source}: ${r.Value}`).join(' — ') : 'N/A'}</p>
          <p><span class="label">DVD :</span> ${formatDateFR(m.DVD)}</p>
          <p><span class="label">Pays :</span> ${m.Country || 'N/A'}</p>
          <p><span class="label">Langue :</span> ${m.Language || 'N/A'}</p>
        </div>
      </div>
    </div>
  `;
}

init();
