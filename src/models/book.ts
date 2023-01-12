export default class Book {
  public subject: string;
  public description: string;
  public author: string;
  public language: string;
  public numberOfPages: number;

  constructor(
    private _id: string,
    private _title: string,
    private _cover: string,
    private _publishedAt: string,
    private _upvotes: number,
    private _downvotes: number
  ) {}

  get id(): string {
    return this._id;
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

  get upvotes(): number {
    return this._upvotes;
  }
  set upvotes(value: number) {
    this._upvotes = value;
  }

  get downvotes(): number {
    return this._downvotes;
  }
  set downvotes(value: number) {
    this._downvotes = value;
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

    book.subject = json.subject;
    book.description = json.description;
    book.author = json.author;
    book.language = json.language;
    book.numberOfPages = json.number_of_pages;

    return book;
  }
}
