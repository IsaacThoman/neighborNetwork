import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreComponent } from './explore/explore.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';
import { AuthService } from '../services/auth.service.ts';

@Component({
	selector: 'app-explore-page',
	standalone: true,
	imports: [ExploreComponent, BottomNavigationComponent],
	template: `
		<app-explore></app-explore>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ExplorePageComponent implements OnInit {
	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	async ngOnInit() {
		// Check authentication
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
			this.router.navigate(['/login']);
			return;
		}

		if (!this.authService.isUserProfileComplete()) {
			this.router.navigate(['/profile-edit']);
			return;
		}
	}
}
