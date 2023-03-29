export default class Media {
  public upvotes: number;
  public downvotes: number;

  constructor(
    private _id: string,
    private _title: string,
    private _cover: string,
    private _publishedAt: string,

    upvotes: number,
    downvotes: number
  ) {
    this.upvotes = upvotes;
    this.downvotes = downvotes;
  }

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
}
