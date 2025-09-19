import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  urlapi:string="http://localhost:3000/user";
  router=inject(Router)
  constructor(private http:HttpClient ) { }

  registerUser(user:any): Observable<any> {
    return this.http.post(`${this.urlapi}/register`, user);
  }
  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.post(`${this.urlapi}/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({
          next: () => {
            localStorage.removeItem('token');
             // Clear token
             localStorage.removeItem('user')
            this.router.navigate(['/login'],{
              state: { message: 'You have been logged out successfully.' }, 
            }); 
          },
          error: (err) => {
            console.error('Logout failed', err);
          },
        });
    } else {
      console.warn('No token found for logout');
      this.router.navigate(['/login']); // Redirect even if no token
    }
  }
  requestPasswordReset(email:any):Observable<any> {
    return this.http.post(`${this.urlapi}/request-reset-password`, { email });
  }
  resetPassword(token:any, password:{}): Observable<any> {
    return this.http.post(`${this.urlapi}/reset-password/${token}`, password );
  }
  getUserById(id:string): Observable<any> {
    return this.http.get(`${this.urlapi}/getUser/${id}`);
  }
  searchUsers(query:any): Observable<any> {
    return this.http.get(`${this.urlapi}/search?query=${query}`)
  }
}
