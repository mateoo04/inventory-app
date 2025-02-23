const pool = require('../pool');

const Movie = require('../../model/movie');
const Genre = require('../../model/genre');
const Studio = require('../../model/studio');
const Director = require('../../model/director');

function transformMovie(movie) {
  return new Movie({
    id: movie.movie_id,
    title: movie.title,
    year: movie.year,
    rating: movie.rating,
    genre: new Genre({ id: movie.genre_id, name: movie.genre_name }),
    director: new Director({
      id: movie.director_id,
      fullName: movie.director_full_name,
    }),
    studio: new Studio({ id: movie.studio_id, name: movie.studio_name }),
    isWatched: movie.is_watched,
  });
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

  return rows.length > 0 ? transformMovie(rows.at(0)) : null;
}

async function updateMovie({
  title,
  year,
  genre,
  director,
  studio,
  rating,
  isWatched,
  id,
}) {
  const result = await pool.query(
    `UPDATE movies SET title = $1, year = $2, genre_id = $3,
    director_id = $4, studio_id = $5, rating = $6, is_watched = $7 WHERE movie_id = $8`,
    [title, year, genre.id, director.id, studio.id, rating, isWatched, id]
  );

  return result.rowCount;
}

async function saveMovie({
  title,
  year,
  genre,
  director,
  studio,
  rating,
  isWatched,
  id,
}) {
  const result = await pool.query(
    `INSERT INTO movies (title, year, genre_id, director_id, studio_id, rating, is_watched) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [title, year, genre.id, director.id, studio.id, rating, isWatched]
  );

  return result.rowCount;
}

async function deleteMovie(id) {
  const result = await pool.query(`DELETE FROM movies WHERE movie_id = $1`, [
    id,
  ]);
  return result.rowCount;
}

module.exports = {
  getAllMovies,
  getMovieById,
  updateMovie,
  saveMovie,
  deleteMovie,
};
