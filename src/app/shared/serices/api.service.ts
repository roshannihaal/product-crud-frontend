import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILogin, ISignup } from '../interface/api-interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  signup(body: {
    email: string;
    password: string;
    confirm_password: string;
  }): Observable<ISignup> {
    return this.http.post<ISignup>('/auth/signup', body);
  }

  login(body: { email: string; password: string }): Observable<ILogin> {
    return this.http.post<ILogin>('/auth/login', body);
  }
}
