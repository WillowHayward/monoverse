export interface AuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}

export interface QueenTokenResponse {
    token: string;
}
