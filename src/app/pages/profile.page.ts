import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile/profile.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';
import { AuthService } from '../services/auth.service.ts';

@Component({
	selector: 'app-profile-page',
	standalone: true,
	imports: [ProfileComponent, BottomNavigationComponent],
	template: `
		<app-profile></app-profile>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ProfilePageComponent implements OnInit {
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
