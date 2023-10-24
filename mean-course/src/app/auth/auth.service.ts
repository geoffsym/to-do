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
  private token: string;
  private tokenTimer: NodeJS.Timeout;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(apiUrl + 'signup', authData).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(apiUrl + 'login', authData)
      .subscribe((response) => {
        this.token = response.token;
        if (this.token) {
          const tokenSeconds = response.expiresIn;
          this.setAuthTimer(tokenSeconds);
          const expirationDate = new Date(Date.now() + 1000 * tokenSeconds);
          this.saveAuthData(this.token, expirationDate);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    const tokenSeconds =
      (authInfo.expirationDate.getTime() - Date.now()) / 1000;
    if (tokenSeconds > 0) {
      this.setAuthTimer(tokenSeconds);
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(seconds: number) {
    console.log()
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, seconds * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (token && expiration) {
      return { token: token, expirationDate: new Date(expiration) };
    } else {
      return null;
    }
  }
}
