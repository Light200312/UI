import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  @Output() authenticated = new EventEmitter<AuthUser>();

  mode: 'login' | 'register' = 'login';
  isSubmitting = false;
  errorMessage = '';
  form = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

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
      next: (user) => {
        this.isSubmitting = false;
        this.authenticated.emit(user);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Authentication failed. Please try again.';
      }
    });
  }
}
