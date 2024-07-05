import { createReducer, on } from '@ngrx/store';
import { loadTodos, addTodo, updateTodo, deleteTodo } from '../actions/todos.actions';
import { TodosState } from '../models/todos.models';

export const initialTodosState: TodosState = {
todos: []
};

export const todosReducer = createReducer(
initialTodosState,
on(loadTodos, (state, { todos }) => ({
...state,
todos
})),
on(addTodo, (state, { todo }) => ({
...state,
todos: [...state.todos, todo]
})),
on(updateTodo, (state, { todo }) => ({
...state,
todos: state.todos.map(t => t.id === todo.id ? todo : t)
})),
on(deleteTodo, (state, { id }) => ({
...state,
todos: state.todos.filter(t => t.id !== id)
}))

/* on(toggleTodoCompletion, (state, { id }) => ({
...state,
todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t) // Toggle the completed status
})), */


);