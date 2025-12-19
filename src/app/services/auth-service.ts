import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { LoginRequest } from '../interface/login-interface';
import { RegisterRequest } from '../interface/register-interface';
import { environment } from '../environment/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly baseUrl = environment.baseUrl;

  readonly isAuthenticated = signal<boolean>(this.getAuthFromStorage());

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.baseUrl}/api/auth/login`, loginRequest)
      .pipe(
        tap((isValid) => {
          if (isValid) {
            this.setAuthenticated(true);
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.clearAuth();
          }
        }),
        catchError((error) => {
          console.error('Login error', error);
          this.clearAuth();
          return of(false);
        })
      );
  }

  register(request: RegisterRequest): Observable<boolean> {
    return this.http
      .post<any>(`${this.baseUrl}/api/auth/register`, request)
      .pipe(
        tap(() => {
          // After successful registration, send user to login
          this.clearAuth();
          this.router.navigateByUrl('/login');
        }),
        map(() => true),
        catchError((error) => {
          console.error('Registration error', error);
          return of(false);
        })
      );
  }

  logout(): void {
    // Clear auth state first
    this.clearAuth();
    // Clear all session and local storage
    sessionStorage.clear();
    // Use window.location to bypass guards and ensure clean navigation
    window.location.href = '/login';
  }

  private setAuthenticated(value: boolean): void {
    sessionStorage.setItem('isAuthenticated', 'true');
    this.isAuthenticated.set(true);
  }

  private clearAuth(): void {
    sessionStorage.removeItem('isAuthenticated');
    this.isAuthenticated.set(false);
  }

  private getAuthFromStorage(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }
}
