class Movie {
  constructor({
    id = null,
    title,
    year,
    genre,
    director,
    studio,
    rating,
    isWatched,
  }) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.genre = genre;
    this.director = director;
    this.studio = studio;
    this.rating = rating;
    this.isWatched = isWatched;
  }
}

module.exports = Movie;
