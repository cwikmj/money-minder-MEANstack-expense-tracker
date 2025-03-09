import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BACKEND_URL = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  login(data: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.BACKEND_URL + '/login', data).pipe(
      tap((res: LoginResponse) => {
        for (const [key, value] of Object.entries(res)) {
          localStorage.setItem(key, value);
        }
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(this.BACKEND_URL + '/logout').pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(this.BACKEND_URL + '/refresh-token').pipe(
      tap((res: { token: string }) => {
        for (const [key, value] of Object.entries(res)) {
          localStorage.setItem(key, value);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(data: { name: string, surname: string, email: string, password: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.BACKEND_URL + '/register', data);
  }

  changePassword(data: { currentPassword: string; newPassword: string, confirmNewPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.BACKEND_URL + '/change-password', data).pipe(
      tap(() => {
        this.clearAuthData();
      })
    )
  }

  updateProfile(data: { name: string, surname: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.BACKEND_URL + '/update-profile', data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getIsAuth(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getCredentials(): string | null {
    return localStorage.getItem('creds');
  }

  private clearAuthData(): void {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
  }

  forceLogout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }
}
