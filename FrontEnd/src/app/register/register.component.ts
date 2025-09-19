import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [RouterModule ,FormsModule,HttpClientModule ,CommonModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
User ={
  nom: '',
  prenom:'',
  password: '',
  email: ''
}
isSubmitting = false; // To disable the button during submission
errorMessage: string | null = null; // Error message display

constructor(private http: HttpClient, private router: Router) {}

// Submit the form
onSubmit(): void {
  if (!this.User.nom ||!this.User.prenom|| !this.User.email || !this.User.password) {
    this.errorMessage = 'All fields are required.';
    return;
  }

  this.isSubmitting = true; // Disable the button
  this.errorMessage = null; // Clear previous errors

  // Send the data to the backend
  this.http.post('http://localhost:3000/user/register', this.User).subscribe({
    next: (response :any) => {
      console.log('Registration successful:', response);
      this.router.navigate(['/login']); // Redirect to login page
    },
    error: (error:any) => {
      console.error('Error during registration:', error);
      this.errorMessage = error.error.message || 'Registration failed.';
      this.isSubmitting = false; // Re-enable the button
    },
    complete: () => {
      this.isSubmitting = false; // Re-enable the button
    },
  });
}
}
