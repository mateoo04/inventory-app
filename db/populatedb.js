const pool = require('./pool.js');

const databaseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_DATABASE_URL
    : process.env.DEVELOPMENT_DATABASE_URL;

const genresTableSQL = `CREATE TABLE IF NOT EXISTS genres(
    genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR(255) NOT NULL
);`;

const directorsTableSQL = `CREATE TABLE IF NOT EXISTS directors(
    director_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE
);`;

const studiosTableSQL = `CREATE TABLE IF NOT EXISTS studios(
    studio_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255)
);`;

const moviesTableSQL = `CREATE TABLE IF NOT EXISTS movies(
    movie_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    genre_id INTEGER REFERENCES genres(genre_id) ON DELETE CASCADE,
    director_id INTEGER REFERENCES directors(director_id) ON DELETE SET NULL,
    studio_id INTEGER REFERENCES studios(studio_id) ON DELETE SET NULL,
    rating DECIMAL,
    is_watched BOOLEAN
);`;

async function main() {
  console.log('Seeding...');
  await pool.query(genresTableSQL);
  await pool.query(directorsTableSQL);
  await pool.query(studiosTableSQL);
  await pool.query(moviesTableSQL);
  console.log('Done');
}

main();
