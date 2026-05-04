import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { AuthUser } from '../models/user.model';

interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly tokenKey = 'todo-auth-token';
  private readonly userKey = 'todo-auth-user';
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());

  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  hydrateSessionFromStorage(): AuthUser | null {
    const token = this.getToken();
    const user = this.readStoredUser();

    if (!token || !user) {
      this.clearSession();
      return null;
    }

    this.userSubject.next(user);
    return user;
  }

  register(payload: { name: string; email: string; password: string }): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => this.storeSession(response)),
      map((response) => response.user)
    );
  }

  login(payload: { email: string; password: string }): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.storeSession(response)),
      map((response) => response.user)
    );
  }

  restoreSession(): Observable<AuthUser | null> {
    const token = this.getToken();
    if (!token) {
      this.clearSession();
      return of(null);
    }

    return this.http
      .get<{ user: AuthUser }>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() })
      .pipe(
        tap((response) => this.storeUserOnly(response.user)),
        map((response) => response.user),
        catchError(() => {
          this.clearSession();
          return of(null);
        })
      );
  }

  logout(): void {
    this.clearSession();
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  private storeSession(response: AuthResponse): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.tokenKey, response.token);
      window.localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }

    this.userSubject.next(response.user);
  }

  private storeUserOnly(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    this.userSubject.next(user);
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.tokenKey);
      window.localStorage.removeItem(this.userKey);
    }

    this.userSubject.next(null);
  }

  private readStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage.getItem(this.userKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  }
}
