import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Todo } from '../store/models/todos.models';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CommonModule, DatePipe } from '@angular/common';
import { selectCompletedTodos } from '../store/selectors/todos.selectors';
import { TodosService } from '../services/todos.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UnixTimestampToDatePipe } from '../pipes/unix-timestamp-to-date.pipe';

@Component({
  selector: 'app-archive-table',
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  standalone: true,
  providers: [DatePipe],
  imports: [
    RouterLink,
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    UnixTimestampToDatePipe
  ],
})
export class ArchiveComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Todo>;
  dataSource: MatTableDataSource<Todo>;
  displayedColumns = [
    'id',
    'beschreibung',
    'erledigt',
    'faellig',
    'prioritaet',
  ];
  completedTodos$: Observable<Todo[]>;

  constructor(
    private todosService: TodosService,
    private datePipe: DatePipe,
    private store: Store<{ todos: Todo[] }>
  ) {
    this.dataSource = new MatTableDataSource<Todo>();
    this.completedTodos$ = this.store.select(selectCompletedTodos);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadTodos();
  }

  loadTodos(): void {
    this.completedTodos$.subscribe((todos: Todo[]) => {
      this.dataSource.data = todos;
    });
  }
}
