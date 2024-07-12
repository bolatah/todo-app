import { Component, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TodosTableComponent } from './todos-table/todos-table.component';
import {
  MatDialog,
  MatDialogModule,

} from '@angular/material/dialog';


import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule, select } from '@ngrx/store';
import { Observable, map, shareReplay } from 'rxjs';

import { selectAuthToken, selectIsAuthenticated } from './store/selectors/auth.selectors';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    NavigationComponent,
    DashboardComponent,
    TodosTableComponent,
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-todo-probearbeit';
  @ViewChild('drawer') drawer!: MatSidenav; 
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


}
