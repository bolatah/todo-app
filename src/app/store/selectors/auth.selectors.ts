
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { User } from "../models/auth.models";


export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  }


export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthenticatedUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);







  