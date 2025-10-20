export interface LoginResponse {
    token: string;
    refreshToken: string;
    identifier: number;
    expiration: number;
}