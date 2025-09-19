import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [RouterModule , FormsModule ,HttpClientModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  credentials = {
    email: '',
    password: '',
  };
  message: string | null = null;  
  isSubmitting = false;
  isError: boolean=true
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:3000/user'; // Replace with your backend URL

  constructor(private http: HttpClient, private router: Router ){
   
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null; // Clear any previous error

    // Make the POST request to the login endpoint directly in the component
    this.http.post(`${this.apiUrl}/login`, this.credentials).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response.user.role);
        localStorage.setItem('token', response.token); 
        localStorage.setItem('user', JSON.stringify(response.user));// Store the token in localStorage
       if(response.user.role=='admin'){
         this.router.navigate(['/admindashboard']); // Redirect to the admin dashboard
       }else{
         this.router.navigate(['/dashboard/posts']); // Redirect to the dashboard
       }

       if(response.user.password!==this.credentials.password){
        this.errorMessage =  'Login failed , please try again ';
        // alert(this.errorMessage);
        this.isSubmitting = false; 
        this.isError=false// 
       }
      },
      error: (error :any) => {
        console.log('Login error:', error.message);
        this.errorMessage =  'Login failed , please try again ';
        // alert(this.errorMessage);
        this.isSubmitting = false; 
        this.isError=false// Re-enable the button if error occurs
      },
      complete: () => {
        this.isSubmitting = false; // Re-enable the button after the request is complete
      },
    });
  }
}
