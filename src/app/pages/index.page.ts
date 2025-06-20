import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service.ts';

@Component({
	selector: 'app-index',
	standalone: true,
	template: `<div class="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
		<div class="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
	</div>`,
})
export default class IndexComponent implements OnInit {
	constructor(
		private router: Router,
		private authService: AuthService,
	) {}

	async ngOnInit() {
		// Check if user is authenticated
		let user = this.authService.getCurrentUser();
		const storedAlias = this.authService.getStoredAlias();

		// If no stored alias, redirect to login
		if (!storedAlias) {
			this.router.navigate(['/login']);
			return;
		}

		// If user data is not loaded yet, try to refresh it
		if (!user) {
			try {
				user = await this.authService.refreshUserData();
			} catch (error) {
				console.error('Failed to load user data:', error);
				this.router.navigate(['/login']);
				return;
			}
		}

		if (!user) {
			// Still no user data, go to login
			this.router.navigate(['/login']);
		} else if (!this.authService.isUserProfileComplete()) {
			// Logged in but profile incomplete, go to edit
			this.router.navigate(['/profile-edit']);
		} else {
			// Logged in and profile complete, go to explore
			this.router.navigate(['/explore']);
		}
	}
}
