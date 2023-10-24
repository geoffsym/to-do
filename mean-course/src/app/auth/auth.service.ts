import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { response } from 'express';

const apiUrl = 'http://localhost:3000/api/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private userId: string;
  private token: string;
  private tokenTimer: NodeJS.Timeout;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(apiUrl + 'signup', authData).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.authStatusListener.next(false);
      },
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ userId: string; token: string; expiresIn: number }>(
        apiUrl + 'login',
        authData
      )
      .subscribe({
        next: (response) => {
          this.token = response.token;
          if (this.token) {
            const tokenSeconds = response.expiresIn;
            this.setAuthTimer(tokenSeconds);
            const expirationDate = new Date(Date.now() + 1000 * tokenSeconds);
            this.saveAuthData(this.userId, this.token, expirationDate);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.authStatusListener.next(false);
        },
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (authInfo) {
      const tokenSeconds =
        (authInfo.expirationDate.getTime() - Date.now()) / 1000;
      if (tokenSeconds > 0) {
        this.setAuthTimer(tokenSeconds);
        this.userId = authInfo.userId;
        this.token = authInfo.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(seconds: number) {
    console.log();
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, seconds * 1000);
  }

  private saveAuthData(userId: string, token: string, expirationDate: Date) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (userId && token && expiration) {
      return {
        userId: userId,
        token: token,
        expirationDate: new Date(expiration),
      };
    } else {
      return null;
    }
  }
}
