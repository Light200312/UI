import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) {
    // Hydrate from localStorage immediately to avoid flash
    const user = this.authService.hydrateSessionFromStorage();
    this.isCheckingSession = !user;
  }

  ngOnInit(): void {
    // Validate the stored token against the backend
    this.authService.restoreSession().subscribe((user) => {
      this.isCheckingSession = false;

      if (user) {
        // Already authenticated — go to dashboard if on login page
        const currentPath = this.router.url;
        if (currentPath === '/login' || currentPath === '/') {
          this.router.navigate(['/dashboard']);
        }
      } else {
        // No valid session — redirect to login
        this.router.navigate(['/login']);
      }
    });
  }
}
