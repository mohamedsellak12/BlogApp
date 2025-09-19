import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGardService implements CanActivate {

  constructor(private router:Router) { }
  canActivate(): MaybeAsync<GuardResult> {
    if(typeof window !== 'undefined' && window.localStorage){
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']); // Redirect to login if no token
      return false;
    }

    // Check if the user object exists in localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user || !user.role) {
      this.router.navigate(['/login']); // Redirect to login if no user or role
      return false;
    }

    // Check if the user role is allowed (e.g., "admin")
    if (user.role === 'admin') {
      return true; // Allow access if the role is "user"
    } else {
      this.router.navigate(['/dashboard']); // Redirect to login or an access-denied page if the role doesn't match
      return false;
    }
      
  }else{
    return false; // Return false if window object is undefined or localStorage is not available
  }
  }
}
