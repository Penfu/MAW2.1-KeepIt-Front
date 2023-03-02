import Media from "@/models/media";

export default class Book extends Media {
  public subjects!: string[];
  public description!: string;
  public authors!: string[];
  public language!: string;
  public numberOfPages!: number;
  public userVote: number = 0

  constructor(
    _id: string,
    _upvotes: number,
    _downvotes: number,

    private _title: string,
    private _cover: string,
    private _publishedAt: string,
  ) { 
    super(_id, _upvotes, _downvotes);
  }

  get title(): string {
    return this._title;
  }

  get cover(): string {
    return this._cover;
  }

  get publishedAt(): string {
    return this._publishedAt;
  }

  static fromJson(json: any): Book {
    const book = new Book(
      json.id,
      json.upvotes,
      json.downvotes,
      json.title,
      json.cover,
      json.published_at,
    );

    book.subjects = json.subjects;
    book.description = json.description;
    book.authors = json.authors;
    book.language = json.language;
    book.numberOfPages = json.number_of_pages;

    book.userVote = json.user_vote;

    return book;
  }
}
