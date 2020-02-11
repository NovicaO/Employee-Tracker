export interface User {
    uid: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: number;
    isAdmin? : boolean;
    isActivated? : boolean;
    canSeeCalendar?: boolean;
    tokenId?: string;
    expiresIn?: Date;
}