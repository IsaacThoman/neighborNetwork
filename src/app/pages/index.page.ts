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
		private authService: AuthService
	) {}

	ngOnInit() {
		// Check if user is authenticated
		const user = this.authService.getCurrentUser();
		
		if (!user) {
			// Not logged in, go to login
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
