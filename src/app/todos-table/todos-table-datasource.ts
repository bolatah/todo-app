import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { TodosService } from '../services/todos.service';
import { Todo } from '../store/models/todos.models';
import { Store } from '@ngrx/store';
import { selectAllTodos } from '../store/selectors/todos.selectors';

/**
 * Data source for the TodosTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TodosTableDataSource extends DataSource<Todo> {
  data: Todo[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(
    private todosService: TodosService,
    private store: Store<{ todos: Todo[] }>
  ) {
    super();
    this.todosService.data$.subscribe((data: Todo[]) => {
      this.data = data;
      this.updateDataSource();
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Todo[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Todo[]): Todo[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.slice(startIndex, startIndex + this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */

  private getSortedData(data: Todo[]): Todo[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'beschreibung':
          return this.compare(a.beschreibung, b.beschreibung, isAsc);
        case 'id':
          return this.compare(+a.id, +b.id, isAsc);
        case 'faellig':
          return this.compare(a.faellig, b.faellig, isAsc); // Add date comparison
        default:
          return 0;
      }
    });
  }

 
  /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
  private compare(
    a: string | number,
    b: string | number,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  /**
   * Update the data source when changes occur (e.g., after add, edit, delete).
   */
  private updateDataSource(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.connect().subscribe();
  }
}
