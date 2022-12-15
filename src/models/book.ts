export default class Book {
  constructor(
    private _id: string,
    private _title: string,
    private _release: string,
    private _upvote: number,
    private _downvote: number
  ) {}

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get release(): string {
        return this._release;
    }

    get upvote(): number {
        return this._upvote;
    }
    set upvote(value: number) {
        this._upvote = value;
    }

    get downvote(): number {
        return this._downvote;
    }
    set downvote(value: number) {
        this._downvote = value;
    }
}
