import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, map } from 'rxjs';
import { AuthState } from '../store/models/auth.models';
import { login, logout } from '../store/actions/auth.actions';
import { selectIsAuthenticated } from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9002/login';
  // auth$ = Observable<AuthState>;
  constructor(
    private httpClient: HttpClient,
    private store: Store<{ auth: AuthState }>
  ) {
    // this.auth$ = this.store.select(state => state.auth)
  }

  // Log in the user and update the store with the token and user information
  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(this.apiUrl, { username, password }).pipe(
      map((response: any) => {
        // Assuming response contains a token and user information
        this.store.dispatch(
          login({
            token: response.token,
            user: { username: response.username, password: response.password },
          })
        );
        return response;
      }),
      catchError((error) => {
        // Handle login errors appropriately
        console.error('Login failed', error);
        throw error; // You might want to handle this error more gracefully in a real app
      })
    );
  }

  // Log out the user by clearing the authentication state
  logout(): void {
    this.store.dispatch(logout());
    // You may also want to clear stored tokens or user information here
  }

  // Check if the user is authenticated by selecting the state from the store
  isAuthenticated(): Observable<boolean> {
    return this.store.pipe(select(selectIsAuthenticated));
  }
}
