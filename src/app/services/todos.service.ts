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
import { AuthState, selectAuthToken } from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private apiUrl = 'https://todo-app-with-angular-18-9db2a73c8e74.herokuapp.com/todos';
  private apiUrlForActions = 'https://todo-app-with-angular-18-9db2a73c8e74.herokuapp.com/todo';
  //private token$ = this.store.select(selectAuthToken);

  constructor(
    private store: Store<{ auth: AuthState; todos: TodosState }>,
    private httpClient: HttpClient
  ) {
    this.getTodos().subscribe(() => {});
  }


  getTodos(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(this.apiUrl).pipe(
      tap((todos: Todo[]) => {
        this.store.dispatch(loadTodos({ todos }));
      })
    );
  }

  getTodoById(id: number): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.apiUrlForActions}/${id}`);
  }

  addTodo(todo: Todo) {
    return this.httpClient
      .put<Todo>(this.apiUrlForActions, todo)
      .pipe(
        tap((newTodo: Todo) => {
          this.store.dispatch(addTodo({ todo: newTodo }));
        })
      );
  }

  updateTodo(todo: Todo, id: number) {
    return this.httpClient
      .post<Todo>(`${this.apiUrlForActions}/${id}`, todo)
      .pipe(
        tap((updatedTodo: Todo) => {
          this.store.dispatch(updateTodo({ todo: updatedTodo }));
        })
      );
  }

  deleteTodo(id: number) {
    return this.httpClient.delete<void>(`${this.apiUrlForActions}/${id}`).pipe(
      tap(() => {
        this.store.dispatch(deleteTodo({ id }));
      })
    );
  }

  markAsCompleted(todo: Todo, id: number): Observable<Todo> {
    const revisedTodo = {
      ...todo,
      erledigt: true,
    };
    return this.httpClient
      .post<Todo>(`${this.apiUrlForActions}/${id}`, revisedTodo)
      .pipe(
        tap((updatedTodo: Todo) => {
          this.store.dispatch(updateTodo({ todo: updatedTodo }));
        })
      );
  }

  markAsIncomplete(todo: Todo, id: number): Observable<Todo> {
    const revisedTodo = {
      ...todo,
      erledigt: false,
    };
    return this.httpClient
      .post<Todo>(`${this.apiUrlForActions}/${id}`, revisedTodo)
      .pipe(
        tap((updatedTodo: Todo) => {
          this.store.dispatch(updateTodo({ todo: updatedTodo }));
        })
      );
  }
}
