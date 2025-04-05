import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);


  // API_URL = environment.API_URL;
  API_URL = "test"

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  userLogin(req: any){
    return this.http.post(`${this.API_URL}login`,req);
  }

  userRegister(req: any){
    return this.http.post(`${this.API_URL}register`,req);
  }
}
