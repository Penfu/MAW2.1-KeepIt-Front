export default class Media {
    public upvotes: number;
    public downvotes: number;

    constructor(
        private _id: string,
        upvotes: number,
        downvotes: number,
    ) {
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }

    get id(): string {
        return this._id;
    }
}