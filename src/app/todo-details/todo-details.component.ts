// src/app/todo-details/todo-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodosService } from '../services/todos.service';
import { Todo } from '../store/models/todos.models';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss']
})
export class TodoDetailsComponent implements OnInit {
  todoId: number | null = null;
  todo: Todo | null = null;

  constructor(
    private route: ActivatedRoute,
    private todosService: TodosService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.todoId = Number(params.get('id'));
      if (this.todoId) {
        this.todosService.getTodoById(this.todoId).subscribe(todo => {
          this.todo = todo;
        });
      }
    });
  }
}
