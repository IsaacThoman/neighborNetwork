import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service.ts';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	async canActivate(): Promise<boolean> {
		const user = this.authService.getCurrentUser();
		const storedAlias = this.authService.getStoredAlias();

		// If no stored alias, redirect to login
		if (!storedAlias) {
			this.router.navigate(['/login']);
			return false;
		}

		// If user data is not loaded yet, try to refresh it
		if (!user) {
			try {
				const refreshedUser = await this.authService.refreshUserData();
				if (!refreshedUser) {
					this.router.navigate(['/login']);
					return false;
				}
			} catch {
				this.router.navigate(['/login']);
				return false;
			}
		}

		const currentUser = this.authService.getCurrentUser();
		if (!currentUser) {
			this.router.navigate(['/login']);
			return false;
		}

		// Check if user is admin
		if (currentUser.alias === 'ADMIN') {
			this.router.navigate(['/admin']);
			return false;
		}

		if (!this.authService.isUserProfileComplete()) {
			this.router.navigate(['/profile/edit']);
			return false;
		}

		return true;
	}

	async canActivateProfileEdit(): Promise<boolean> {
		const user = this.authService.getCurrentUser();
		const storedAlias = this.authService.getStoredAlias();

		// If no stored alias, redirect to login
		if (!storedAlias) {
			this.router.navigate(['/login']);
			return false;
		}

		// If user data is not loaded yet, try to refresh it
		if (!user) {
			try {
				const refreshedUser = await this.authService.refreshUserData();
				if (!refreshedUser) {
					this.router.navigate(['/login']);
					return false;
				}
			} catch {
				this.router.navigate(['/login']);
				return false;
			}
		}

		return true;
	}

	async canActivateAdmin(): Promise<boolean> {
		const user = this.authService.getCurrentUser();
		const storedAlias = this.authService.getStoredAlias();

		// If no stored alias, redirect to login
		if (!storedAlias) {
			this.router.navigate(['/login']);
			return false;
		}

		// If user data is not loaded yet, try to refresh it
		if (!user) {
			try {
				const refreshedUser = await this.authService.refreshUserData();
				if (!refreshedUser) {
					this.router.navigate(['/login']);
					return false;
				}
			} catch {
				this.router.navigate(['/login']);
				return false;
			}
		}

		const currentUser = this.authService.getCurrentUser();
		if (!currentUser) {
			this.router.navigate(['/login']);
			return false;
		}

		if (currentUser.alias !== 'ADMIN') {
			this.router.navigate(['/']);
			return false;
		}

		return true;
	}
}
