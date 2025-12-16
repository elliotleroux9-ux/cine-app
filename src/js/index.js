import { searchMovies } from './api.js';

const trendingEl = document.getElementById('trending-movies');
const loadMoreBtn = document.getElementById('load-more');
const randomMoviesEl = document.getElementById('random-movies');
const loadRandomBtn = document.getElementById('load-random');

// Choix des tendances
const trendingList = [
  'Guardians of the Galaxy',
  'Inception',
  'The Matrix',
  'Interstellar',
  'Spider-Man: Into the Spider-Verse',
  'star',
  'Shrek',
  'The Dark Knight',
  'fight club',
];

let current = 0;
const PAGE_SIZE = 3;

async function renderNextBatch() {
  const batch = trendingList.slice(current, current + PAGE_SIZE);
  for (const title of batch) {
    try {
      const data = await searchMovies(title, 1);
      const film = data.Search?.[0];
      if (film) {
        const card = createCard(film);
        trendingEl.appendChild(card);
      }
    } catch (err) {
      console.warn('Erreur fetch trending', err);
    }
  }
  current += PAGE_SIZE;
  
  // Afficher/masquer le bouton correctement
  if (current >= trendingList.length) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

function createCard(film) {
  const a = document.createElement('a');
  a.href = `movie.html?id=${film.imdbID}`;
  a.className = 'card';
  a.setAttribute('aria-label', film.Title);
  a.innerHTML = `
    <img src="${film.Poster !== 'N/A' ? film.Poster : '/public/no-poster.png'}" alt="Affiche de ${film.Title}" />
    <h3>${film.Title} <span class="year">(${film.Year})</span></h3>
    <p><a href="movie.html?id=${film.imdbID}">En savoir plus</a></p>
  `;
  return a;
}

loadMoreBtn.addEventListener('click', renderNextBatch);
renderNextBatch();

// Mots pour générer aléatoires
const randomKeywords = [
    "love", "war", "space", "dog", "life", 
    "star", "fire", "king", "world", "magic",
    "dream", "death", "future", "dark", "blood"
];

async function getRandomMovies() {
    const keyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    const data = await searchMovies(keyword, 1);
    if (!data.Search) return [];
    const shuffled = data.Search.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
}

function displayRandomMovies(movies) {
    movies.forEach(movie => {
        const card = createCard(movie);
        randomMoviesEl.appendChild(card);
    });
}

async function loadRandomSection() {
    const movies = await getRandomMovies();
    displayRandomMovies(movies);
}

loadRandomBtn.addEventListener('click', loadRandomSection);
loadRandomSection();

// Carousel controls
const trendingCarousel = document.getElementById("trending-movies");
const randomCarousel = document.getElementById("random-movies");

document.getElementById("scroll-left-trending").addEventListener("click", () => {
    trendingCarousel.scrollBy({ left: -300, behavior: "smooth" });
});

document.getElementById("scroll-right-trending").addEventListener("click", () => {
    trendingCarousel.scrollBy({ left: 300, behavior: "smooth" });
});

document.getElementById("scroll-left-random").addEventListener("click", () => {
    randomCarousel.scrollBy({ left: -300, behavior: "smooth" });
});

document.getElementById("scroll-right-random").addEventListener("click", () => {
    randomCarousel.scrollBy({ left: 300, behavior: "smooth" });
});
