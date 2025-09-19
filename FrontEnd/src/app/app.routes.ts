import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGardService } from './services/auth-gard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginGardService } from './services/login-gard.service';
import { AddPostComponent } from './add-post/add-post.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGardService } from './services/admin-gard.service';
import { PostComponent } from './post/post.component';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    canActivate: [LoginGardService], 
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [LoginGardService], 
   

  },
  {
    path:'reset-password/:token',
    component:ResetPasswordComponent,
    title: 'Reset Password',
    canActivate: [LoginGardService]  
  },
  {
    path:'password-forgot',
    component:RequestPasswordResetComponent,
    title: 'Password Reset',
    canActivate: [LoginGardService]  
  }
  ,
  {
    path:'admindashboard',
    component:AdminDashboardComponent,
    title:'Admin Dashboard',
    canActivate:[AdminGardService]
  },
  
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [AuthGardService],
    children: [
      {
        path: 'profile', // Nested route under Dashboard
        component: ProfileComponent,
        title: 'Profile',
      },{
        path:'addpost',
        component: AddPostComponent,
        title: 'Post',
      },{
        path:'posts',
        component: PostComponent,
        title: 'Posts',
      },
      {
        path:'Your-posts',
        component:UserPostsComponent,
        title: 'Your Posts',
      },
      {
        path:'userProfile/:id',
        component:UserProfileComponent,
        title: 'User Profile',
      }
      ,
      {
        path:'chats',
        component:ChatsComponent,
        title: 'Chats',
      },
      {
        path:'conversation/:id',
        component:ConversationComponent,
        title: 'Conversation',
      }
    ],
  },
];
