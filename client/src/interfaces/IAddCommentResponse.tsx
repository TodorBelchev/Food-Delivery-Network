import IComment from "./IComment";

export default interface IAddCommentResponse {
    comments: IComment[];
    rating: number;
    ratingsCount: number;
}