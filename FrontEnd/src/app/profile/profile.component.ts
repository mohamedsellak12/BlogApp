import { Component, OnInit } from '@angular/core';
import { ProfileServiceService } from '../services/profile-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule , CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user :any;

  popup :boolean=false;
  password='';
  
  User ={
    currentPassword: '',
    newPassword: ''
  }
  confirmPassword:string=''
  profile: any;
  constructor(public profileService: ProfileServiceService){}

  ngOnInit(): void {
  
    const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
      // console.log("",this.user.nom)
      this.profileService.getProfile().subscribe({
        next: (response) => {
          // console.log(response);
          this.profile = response;
        },
        error: (err) => {
          console.error(err);
        }
      })
  }
  updateUserPasword(){
    if (this.User.newPassword && this.User.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      //  this.User.newPassword='',
       this.confirmPassword=''
      return;
    }
    this.profileService.updateProfile( this.User,this.profile.user.id).subscribe({
      next: (response) => {
        console.log(response);
        alert(response.message)
      },
      error: (err) => {

        console.error(err);
      }
    })
    this.User.currentPassword='',
    this.User.newPassword='',
    this.confirmPassword=''
  }
  updateUserInfos(){
    this.profileService.updateUserInfos(this.user,this.profile.user.id).subscribe({
      next: (response) => {
        console.log(response);
        this.user=response.user
        
        alert(response.message)
      },
      error: (err) => {
        console.error(err.message);
        alert(err.message)
  }
}
)
}

deleteUserAccount(event: Event): void {
  this.profileService.deleteUser( {
    body: { password: this.password }
  } ,this.profile.user.id).subscribe({
    
    next: (response) => {
      console.log(response);
      alert(response.message);
      if(response.message==='User deleted successfully'){
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      this.password=''
    },
    error: (err) => {
      console.error(err);
      alert(err.message);
    }
  })
}
ShowPopup(event: Event): void {
  event.preventDefault();
  this.popup = true;
}
ClosePopup(): void {
  this.popup = false;
}
  


}
