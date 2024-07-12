import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TodosService } from '../services/todos.service';
import { Todo } from '../store/models/todos.models';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoActionDialogComponent } from '../todo-aktion-dialog/todo-action.component';
import { CommonModule, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAllTodos,
  selectCompletedTodos,
  selectActiveTodos,
} from '../store/selectors/todos.selectors';
import { RouterLink } from '@angular/router';
import { UnixTimestampToDatePipe } from '../pipes/unix-timestamp-to-date.pipe';

@Component({
  selector: 'app-todos-table',
  templateUrl: './todos-table.component.html',
  styleUrl: './todos-table.component.scss',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterLink,
    UnixTimestampToDatePipe,
  ],
})
export class TodosTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Todo>;
  displayedColumns = [
    'id',
    'beschreibung',
    'erledigt',
    'faellig',
    'prioritaet',
    'actions',
  ];

  allTodos$: Observable<Todo[]>;
  constructor(
    private todosService: TodosService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private store: Store<{ todos: Todo[] }>
  ) {
    this.dataSource = new MatTableDataSource<Todo>();
    this.allTodos$ = this.store.select(selectAllTodos);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadTodos();
  }

  loadTodos(): void {
    this.allTodos$.subscribe((todos: Todo[]) => {
      this.dataSource.data = todos;
    });
  }

  openDialog(action: string, todo?: Todo): void {
    let dialogRef;
    if (action === 'Add') {
      dialogRef = this.dialog.open(TodoActionDialogComponent, {
        width: '300px',
        data: { action: action },
      });
    } else if (action === 'Edit') {
      dialogRef = this.dialog.open(TodoActionDialogComponent, {
        width: '300px',
        data: { action: action, todo: todo },
      });
    } else if (action === 'Complete') {
      dialogRef = this.dialog.open(TodoActionDialogComponent, {
        width: '300px',
        data: { action: action, todo: todo },
      });
    } else if (action === 'Incomplete') {
      dialogRef = this.dialog.open(TodoActionDialogComponent, {
        width: '300px',
        data: { action: action, todo: todo },
      });
    }
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (action === 'Add') {
            this.loadTodos();
          } else if (action === 'Edit') {
            this.loadTodos();
          }
        }
      });
    }
  }


  deleteTodo(todo: Todo): void {
    this.todosService.deleteTodo(todo.id).subscribe(() => {
      this.loadTodos();
    });
  }
}
