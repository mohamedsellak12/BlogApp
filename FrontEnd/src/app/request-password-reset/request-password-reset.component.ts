import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  imports: [CommonModule ,FormsModule ,RouterModule],
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.css'
})
export class RequestPasswordResetComponent {
  email: string='';
  message: string='';
  isSuccess: boolean=false;

  constructor(private userService:UserServiceService) { }
  onSubmit(){
    this.userService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.message = 'Password reset email sent successfully.';
        this.isSuccess = true;
      },
      error: (err) => {
        this.message = err.error.message;
        this.isSuccess = false;
      }
    })

  }
}
