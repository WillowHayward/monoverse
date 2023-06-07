export interface TokenStore {
    token: string;
    refresh: string;
    generated: number;
    expires: number;
}
