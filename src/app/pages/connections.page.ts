import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionsComponent } from './connections/connections.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';
import { AuthService } from '../services/auth.service.ts';

@Component({
	selector: 'app-connections-page',
	standalone: true,
	imports: [ConnectionsComponent, BottomNavigationComponent],
	template: `
		<app-connections></app-connections>
		<app-bottom-navigation></app-bottom-navigation>
	`,
})
export default class ConnectionsPageComponent implements OnInit {
	constructor(
		private router: Router,
		private authService: AuthService,
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
