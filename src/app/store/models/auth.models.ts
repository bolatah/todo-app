export interface User {
    username : string;
    password: string;
}

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: any | null;
    }