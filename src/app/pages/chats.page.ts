import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatsComponent } from './chats/chats.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';
import { AuthService } from '../services/auth.service.ts';

@Component({
	selector: 'app-chats-page',
	standalone: true,
	imports: [ChatsComponent, BottomNavigationComponent],
	template: `
		<app-chats></app-chats>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ChatsPageComponent implements OnInit {
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
