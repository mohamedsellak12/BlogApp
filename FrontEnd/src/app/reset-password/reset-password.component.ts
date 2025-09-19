import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,RouterModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  newPassword: string='';
  token: string='';
  message: string='';
  isSuccess: boolean=false;

  constructor(private router:Router , private route:ActivatedRoute , private userService:UserServiceService) { }
  ngOnInit(): void {
      this.token=this.route.snapshot.paramMap.get('token')||'';
      console.log(this.token);
      console.log(this.newPassword)
  }
  onSubmit(): void {
    const payload = { newPassword: this.newPassword };
    this.userService.resetPassword(this.token,payload).subscribe({
      next: (data: any) => {
      
       this.message='Password reset successfully!';
        this.isSuccess=true;
        // this.router.navigate(['/login']);
      },
      error: (error: any) => {
        
        this.message=error.error.message;
        this.isSuccess=false;
      }
    })

  }
}
