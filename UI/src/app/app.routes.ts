import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/todo-list/todo-list.component').then((m) => m.TodoListComponent),
    canActivate: [authGuard]
  },
  {
    // Routing parameter: task detail page accessible via /task/:id
    path: 'task/:id',
    loadComponent: () =>
      import('./components/task-detail/task-detail.component').then((m) => m.TaskDetailComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
