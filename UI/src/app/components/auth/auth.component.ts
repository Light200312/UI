import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  isSubmitting = false;
  errorMessage = '';
  form = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = '';
  }

  submit(): void {
    this.errorMessage = '';

    if (!this.form.email.trim() || !this.form.password.trim()) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    if (this.mode === 'register' && !this.form.name.trim()) {
      this.errorMessage = 'Name is required to create an account.';
      return;
    }

    this.isSubmitting = true;

    const request$ =
      this.mode === 'register'
        ? this.authService.register({
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            password: this.form.password
          })
        : this.authService.login({
            email: this.form.email.trim(),
            password: this.form.password
          });

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        // Navigate to protected dashboard after successful auth
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Authentication failed. Please try again.';
      }
    });
  }
}
