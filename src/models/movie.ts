import Media from '@/models/media';

export default class Movie extends Media {
  public adult!: boolean;
  public backdropPath!: string;
  public genreIds!: number[];
  public originalLanguage!: string;
  public originalTitle!: string;
  public overview!: string;
  public popularity!: number;
  public genres: string[];
  public productionCompanies: string[];
  public tagline: string;
  public runtime: number;

  public userVote: number = 0;
  public userTime: number = 0;

  constructor(
    _id: string,
    _title: string,
    _poster: string,
    _releaseDate: string,
    _upvotes: number,
    _downvotes: number
  ) {
    super(_id, _title, _poster, _releaseDate, _upvotes, _downvotes);
  }

  static fromJson(json: any): Movie {
    const movie = new Movie(
      json.id,
      json.title,
      json.poster_path,
      json.release_date,
      json.upvotes,
      json.downvotes
    );

    movie.adult = json.adult;
    movie.backdropPath = json.backdrop_path;
    movie.genreIds = json.genre_ids;
    movie.originalLanguage = json.original_language;
    movie.originalTitle = json.original_title;
    movie.overview = json.overview;
    movie.popularity = json.popularity;
    movie.genres = json.genres;
    movie.productionCompanies = json.production_companies;
    movie.tagline = json.tagline;
    movie.runtime = json.runtime;
    movie.userVote = json.user_vote;
    movie.userTime = json.user_time;

    return movie;
  }
}
