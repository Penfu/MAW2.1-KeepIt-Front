export default class Book {
  constructor(
    private _id: string,
    private _title: string,
    private _cover: string,
    private _published_at: string,
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

  get published_at(): string {
    return this._published_at;
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
    return new Book(
      json.id,
      json.title,
      json.cover,
      json.published_at,
      json.upvotes,
      json.downvotes
    );
  }
}
