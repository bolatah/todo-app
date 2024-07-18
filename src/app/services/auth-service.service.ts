import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, map } from 'rxjs';
import { login, logout } from '../store/actions/auth.actions';
import { AuthState, selectIsAuthenticated } from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://todo-app-with-angular-18-9db2a73c8e74.herokuapp.com/api/login';
 
  constructor(
    private httpClient: HttpClient,
    private store: Store<{ auth: AuthState }>
  ) {
   
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(this.apiUrl, { username, password }).pipe(
      map((response: any) => {
        this.store.dispatch(
          login({
            token: response.token,
            user: { username: response.username, password: response.password },
          })
        );
        return response;
      }),
      catchError((error) => {
        console.error('Login failed', error);
        throw error; 
      })
    );
  }

  logout(): void {
    this.store.dispatch(logout());
  }

  isAuthenticated(): Observable<boolean> {
    return this.store.pipe(select(selectIsAuthenticated));
  }
}
