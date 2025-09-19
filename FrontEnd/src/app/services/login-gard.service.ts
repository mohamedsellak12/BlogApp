import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGardService implements CanActivate {
 constructor(private router: Router ) {}

  canActivate(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token'); // Check for the token
      if (token) {
        this.router.navigate(['/dashboard']); // Redirect to dashboard if logged in
        return false; // Prevent access to the login page
      }
    }
    return true;
}
}
