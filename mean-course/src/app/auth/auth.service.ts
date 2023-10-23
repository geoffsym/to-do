import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';

const apiUrl = 'http://localhost:3000/api/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(apiUrl + 'signup', authData).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(apiUrl + 'login', authData).subscribe((response) => {
      console.log(response);
    });
  }
}
