import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todos.models';

export const loadTodos = createAction('[Todos] Load Todos', props<{ todos: Todo[] }>());
export const addTodo = createAction('[Todos] Add Todo', props<{ todo: Todo }>());
export const updateTodo = createAction('[Todos] Update Todo', props<{ todo: Todo }>());
export const deleteTodo = createAction('[Todos] Delete Todo', props<{ id: number }>());