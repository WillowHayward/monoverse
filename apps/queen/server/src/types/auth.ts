export interface AuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
}

export interface QueenTokenResponse {
    token: string;
}
