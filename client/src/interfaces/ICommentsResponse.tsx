import IComment from "./IComment";

export default interface ICommentsResponse {
    comments: IComment[];
    ratingsCount: number;
    tokenExpired: boolean;
}