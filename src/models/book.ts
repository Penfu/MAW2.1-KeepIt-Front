import Media from '@/models/media';

export default class Book extends Media {
  public subjects!: string[];
  public description!: string;
  public authors!: string[];
  public language!: string;
  public numberOfPages!: number;

  public userVote: number = 0;
  public userPage: number = 0;

  constructor(
    _id: string,
    _title: string,
    _cover: string,
    _publishAt: string,
    _upvotes: number,
    _downvotes: number
  ) {
    super(_id, _title, _cover, _publishAt, _upvotes, _downvotes);
  }

  static fromJson(json: any): Book {
    const book = new Book(
      json.id,
      json.title,
      json.cover,
      json.published_at,
      json.upvotes,
      json.downvotes
    );

    book.subjects = json.subjects;
    book.description = json.description;
    book.authors = json.authors;
    book.language = json.language;
    book.numberOfPages = json.number_of_pages;

    book.userVote = json.user_vote;
    book.userPage = json.user_page;

    return book;
  }
}
