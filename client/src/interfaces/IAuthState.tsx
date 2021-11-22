export default interface IAuthState {
    email: string | null;
    _id: string | null;
    isAdmin: boolean;
    firstName?: string | null;
    lastName?: string | null;
    phone?: number | string | null;
    city?: string | null;
    address?: string | null;
    favorites: string[];
}