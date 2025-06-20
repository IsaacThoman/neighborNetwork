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

	ngOnInit() {
		// Check authentication
		const user = this.authService.getCurrentUser();
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
