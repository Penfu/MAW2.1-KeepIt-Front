import Media from '@/models/media'

export default class Movie extends Media {
    constructor(
        _id: string,
        _upvotes: number,
        _downvotes: number,
    ) {
        super(_id, _upvotes, _downvotes);
    }
}