import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthComponent } from './components/auth/auth.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AuthUser } from './models/user.model';
import { AuthService } from './services/auth.service';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TodoListComponent, AuthComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  currentUser: AuthUser | null;
  isCheckingSession = true;

  constructor(
    private authService: AuthService,
    private todoService: TodoService
  ) {
    this.currentUser = this.authService.hydrateSessionFromStorage();
    this.isCheckingSession = !this.currentUser;
  }

  ngOnInit(): void {
    this.authService.restoreSession().subscribe((user) => {
      this.currentUser = user;
      this.isCheckingSession = false;
    });

    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  onAuthenticated(user: AuthUser): void {
    this.currentUser = user;
  }

  onLogout(): void {
    this.authService.logout();
    this.todoService.clearTasks();
  }
}
