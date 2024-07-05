import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from '../models/todos.models';


export const selectTodosState = createFeatureSelector<TodosState>('todos');


export const selectAllTodos = createSelector(
  selectTodosState,
  (state: TodosState) => state.todos
);

export const selectCompletedTodos = createSelector(
  selectTodosState,
  (state: TodosState) => state.todos.filter(todo => todo.erledigt)
);

export const selectActiveTodos = createSelector(
  selectTodosState,
  (state: TodosState) => state.todos.filter(todo => !todo.erledigt)
);



