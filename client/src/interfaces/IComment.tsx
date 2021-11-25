export default interface IComment {
    _id: string;
    name: string;
    comment: string;
    rating: number;
    owner: string;
    restaurant: string;
    date: Date;
}