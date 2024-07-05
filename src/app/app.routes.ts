import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TodosTableComponent } from './todos-table/todos-table.component';
import { ArchiveComponent } from './archive/archive.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', 
        pathMatch: 'full',
        title:"Einloggen"
    },
    {
        path: "login",
        component: LoginComponent,
    },
    
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "todos-table",
        component: TodosTableComponent, 
        canActivate: [AuthGuard]
 
    },
    {
        path: "todo/:id",
        component: TodoDetailsComponent, 
        canActivate: [AuthGuard]
 
    },
    {
        path: "archive",
        component: ArchiveComponent,
        canActivate: [AuthGuard]
    },
      
    {
        path: "**",
        redirectTo: "login",
    },

];

