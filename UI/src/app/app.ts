import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isCheckingSession = true;

  constructor(
    private authService: AuthService,
    private todoService: TodoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Hydrate from localStorage so user$ emits immediately —
    // this lets TodoListComponent know a user exists while we
    // validate the token in the background via restoreSession().
    this.authService.hydrateSessionFromStorage();
  }

  ngOnInit(): void {
    // Always validate the token against the backend before rendering.
    // This ensures user$ has a confirmed value before any component loads tasks.
    this.authService.restoreSession().subscribe((user) => {
      this.isCheckingSession = false;
      // detectChanges() prevents NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
      // that occurs when SSR hydration sees isCheckingSession flip from true to false.
      this.cdr.detectChanges();

      if (user) {
        const currentPath = this.router.url;
        // Only redirect to dashboard from login or root — preserve current route on reload
        if (currentPath === '/login' || currentPath === '/') {
          this.router.navigate(['/dashboard']);
        }
        // Already on /dashboard or /task/:id — stay, tasks will load via afterNextRender
      } else {
        // Token invalid or expired — clear everything and go to login
        this.todoService.clearTasks();
        this.router.navigate(['/login']);
      }
    });
  }
}
