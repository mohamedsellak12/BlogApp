import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../services/post.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [ RouterModule , RouterOutlet ,CommonModule ,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  user: any;
  query:string="";
  searchUsers: any=[];
 
  openLogoutPopup: boolean = false;
  postService=inject(PostService)


  constructor(private userService :UserServiceService,private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    } // Retrieve the user data
   
    console.log('User data:', this.user);
    
  }
  

  
  close(){
    this.searchUsers=[];
    this.query='';
  }
 
  onSearch():void {
    if(this.query && this.query.trim()!=''){
    this.userService.searchUsers(this.query).subscribe({
        next: (users) => {
          console.log(this.query)
          console.log(users)
          this.searchUsers=users;
        },
        error: (error) => {
          console.error('Error:', error);
        }
  
      })
    }else{
      this.searchUsers=[];
    }

    }
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
  logout(){
    this.userService.logout();
  }
  ShowPopup(event: Event): void {
    event.preventDefault();
    this.openLogoutPopup = true;
  }
  ClosePopup(): void {
    this.openLogoutPopup = false;
  }
}
