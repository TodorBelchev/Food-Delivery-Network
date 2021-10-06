export default interface IAuthState {
    email: string | null;
    _id: string | null;
    isAdmin: boolean;
    firstName?: string;
    lastName?: string;
    phoneNumber?: number;
    city?: string;
    location?: string;
}