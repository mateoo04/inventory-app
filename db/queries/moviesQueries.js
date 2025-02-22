const pool = require('../pool');
const CustomNotFoundError = require('../../errors/CustomNotFoundError');

function transformMovie(movie) {
  return {
    movieId: movie.movie_id,
    title: movie.title,
    year: movie.year,
    genreId: movie.genre_id,
    directorId: movie.director_id,
    studioId: movie.studio_id,
    rating: movie.rating,
    isWatched: movie.is_watched,
    genreName: movie.genre_name,
    directorFullName: movie.director_full_name,
    studioName: movie.studio_name,
  };
}

async function getAllMovies() {
  const { rows } = await pool.query(
    `SELECT movies.*, 
    genres.genre_name AS genre_name, 
    directors.full_name AS director_full_name,
    studios.name AS studio_name
    FROM movies
    JOIN genres ON movies.genre_id = genres.genre_id
    JOIN directors ON movies.director_id = directors.director_id
    JOIN studios ON movies.studio_id = studios.studio_id`
  );

  const movies = rows.map(transformMovie);

  return movies;
}

async function getMovieById(id) {
  const { rows } = await pool.query(
    `SELECT movies.*, 
    genres.genre_name AS genre_name, 
    directors.full_name AS director_full_name,
    studios.name AS studio_name
    FROM movies
    JOIN genres ON movies.genre_id = genres.genre_id
    JOIN directors ON movies.director_id = directors.director_id
    JOIN studios ON movies.studio_id = studios.studio_id
    WHERE movies.movie_id = $1`,
    [id]
  );

  if (rows.length === 0) throw new CustomNotFoundError('Movie not found');

  return transformMovie(rows.at(0));
}

async function updateMovie({
  title,
  year,
  genreId,
  directorId,
  studioId,
  rating,
  isWatched,
  id,
}) {
  const result = await pool.query(
    `UPDATE movies SET title = $1, year = $2, genre_id = $3,
    director_id = $4, studio_id = $5, rating = $6, is_watched = $7 WHERE movie_id = $8`,
    [title, year, genreId, directorId, studioId, rating, isWatched, id]
  );

  return result.rowCount;
}

async function saveMovie({
  title,
  year,
  genreId,
  directorId,
  studioId,
  rating,
  isWatched,
  id,
}) {
  const result = await pool.query(
    `INSERT INTO movies (title, year, genre_id, director_id, studio_id, rating, is_watched) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [title, year, genreId, directorId, studioId, rating, isWatched]
  );

  return result.rowCount;
}

module.exports = { getAllMovies, getMovieById, updateMovie, saveMovie };
