import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service.ts';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user is admin
    if (user.alias === 'admin') {
      this.router.navigate(['/admin']);
      return false;
    }

    if (!this.authService.isUserProfileComplete()) {
      this.router.navigate(['/profile/edit']);
      return false;
    }

    return true;
  }

  canActivateProfileEdit(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  canActivateAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.alias !== 'admin') {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
