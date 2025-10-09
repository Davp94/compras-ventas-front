export interface LoginResponse {
    token: string;
    refreshToken: string;
    expiration: number;
}