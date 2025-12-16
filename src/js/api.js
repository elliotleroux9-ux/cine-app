const API_KEY = 'your_api_key_here';
const BASE = 'http://www.omdbapi.com/';

export async function searchMovies(query, page = 1) {
  const url = `${BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'No results');
  return data;
}

export async function getMovieById(imdbID) {
  const url = `${BASE}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Not found');
  return data;
}
