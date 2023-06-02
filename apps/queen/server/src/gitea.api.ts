export interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
}

export interface UserResponse {
    id: number;
    full_name: string;

}

