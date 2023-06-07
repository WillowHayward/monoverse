export interface AuthInitData {
    id: string;
    url: string;
    redirect: string;
    state: string;
}

export interface AuthTokenRequest {
    state: string;
    code: string;
}

export interface AuthTokenResponse {
    token: string;
}

export interface GiteaTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
}

export interface GiteaRepository {
    name: string;
}
