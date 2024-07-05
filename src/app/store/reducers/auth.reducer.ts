import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../actions/auth.actions';
import { AuthState } from '../models/auth.models';

export const initialAuthState: AuthState = {
token: null,
isAuthenticated: false,
user: null,
};

export const authReducer = createReducer(
initialAuthState,
on(login, (state, { token, user }) => ({
...state,
token,
isAuthenticated: true,
user
})),
on(logout, state => ({
...state,
token: null,
isAuthenticated: false,
user: null
}))
);