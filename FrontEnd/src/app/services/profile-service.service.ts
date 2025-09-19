import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  private apiUrl = 'http://localhost:3000/user'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
  updateProfile(updateData: any ,id:any): Observable<any> {
    // const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/update/${id}`, updateData);
  }
  updateUserInfos(userData:any,id:any):Observable<any> {
   
    return this.http.put(`${this.apiUrl}/updateInfo/${id}`, userData);
  }
  deleteUser(password:any,id:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`,password);
  }
}
