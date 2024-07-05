import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, take, map, tap, BehaviorSubject } from 'rxjs';
import { Todo, TodosState } from '../store/models/todos.models';
import {
  addTodo,
  deleteTodo,
  loadTodos,
  updateTodo,
} from '../store/actions/todos.actions';
import { selectAuthToken } from '../store/selectors/auth.selectors';
import { AuthState } from '../store/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private apiUrl = 'http://localhost:9002/todos';
  private apiUrlToAddTodo = 'http://localhost:9002/todo';
  private token$ = this.store.select(selectAuthToken);
  data$ = new BehaviorSubject<Todo[]>([]);
  constructor(
    private store: Store<{ auth: AuthState; todos: TodosState }>,
    private httpClient: HttpClient
  ) {
    this.getTodos().subscribe((res) => {
      this.data$.next(res);
    });
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.token$.pipe(
      take(1),
      map(
        (token) =>
          new HttpHeaders({
            token: `${token}`,
          })
      )
    );
  }

  getTodos(): Observable<Todo[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient.get<Todo[]>(this.apiUrl, { headers }).pipe(
          tap((todos: Todo[]) => {
            this.store.dispatch(loadTodos({ todos }));
          })
        )
      )
    );
  }

  getTodoById(id: number): Observable<Todo> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient.get<Todo>(`${this.apiUrlToAddTodo}/${id}`, { headers })
      )
    );
  }

  addTodo(todo: Todo) {
    const faelligString = todo.faellig;
    const faelligDate = new Date(faelligString);
    const unixTimestamp = faelligDate.getTime();
    const unixTimeStampValue = todo.faellig
      ? Math.floor(unixTimestamp / 1000)
      : null;
    const todoWithErledigt = {
      ...todo,
      faellig: unixTimeStampValue,
      erledigt: false,
    };
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient
          .put<Todo>(this.apiUrlToAddTodo, todoWithErledigt, { headers })
          .pipe(
            tap((newTodo: Todo) => {
              this.store.dispatch(addTodo({ todo: newTodo }));
            })
          )
      )
    );
  }

  updateTodo(todo: Todo, id: number) {
    const faelligString = todo.faellig;
    const faelligDate = new Date(faelligString);
    const unixTimestamp = faelligDate.getTime();
    const unixTimeStampValue = todo.faellig
      ? Math.floor(unixTimestamp / 1000)
      : null;
    const revisedTodo = { ...todo, faellig: unixTimeStampValue };
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient
          .post<Todo>(`${this.apiUrlToAddTodo}/${id}`, revisedTodo, { headers })
          .pipe(
            tap((updatedTodo: Todo) => {
              this.store.dispatch(updateTodo({ todo: updatedTodo }));
            })
          )
      )
    );
  }

  deleteTodo(id: number) {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient
          .delete<void>(`${this.apiUrlToAddTodo}/${id}`, { headers })
          .pipe(
            tap(() => {
              this.store.dispatch(deleteTodo({ id }));
            })
          )
      )
    );
  }

  markAsCompleted(todo: Todo, id: number): Observable<Todo> {
    const faelligString = todo.faellig;
    const faelligDate = new Date(faelligString);
    const unixTimestamp = faelligDate.getTime();
    const unixTimeStampValue = todo.faellig
      ? Math.floor(unixTimestamp / 1000)
      : null;
    const revisedTodo = {
      ...todo,
      faellig: unixTimeStampValue,
      erledigt: true,
    };
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient
          .post<Todo>(`${this.apiUrlToAddTodo}/${id}`, revisedTodo, { headers })
          .pipe(
            tap((updatedTodo: Todo) => {
              this.store.dispatch(updateTodo({ todo: updatedTodo }));
            })
          )
      )
    );
  }

  markAsIncomplete(todo: Todo, id: number): Observable<Todo> {
    const faelligString = todo.faellig;
    const faelligDate = new Date(faelligString);
    const unixTimestamp = faelligDate.getTime();
    const unixTimeStampValue = todo.faellig
      ? Math.floor(unixTimestamp / 1000)
      : null;
    const revisedTodo = {
      ...todo,
      faellig: unixTimeStampValue,
      erledigt: false,
    };
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.httpClient
          .post<Todo>(`${this.apiUrlToAddTodo}/${id}`, revisedTodo, { headers })
          .pipe(
            tap((updatedTodo: Todo) => {
              this.store.dispatch(updateTodo({ todo: updatedTodo }));
            })
          )
      )
    );
  }
}
