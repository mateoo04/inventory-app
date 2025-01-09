const pool = require('../pool');

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

  const movies = rows.map((movie) => ({
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
  }));

  return movies;
}

module.exports = { getAllMovies };
