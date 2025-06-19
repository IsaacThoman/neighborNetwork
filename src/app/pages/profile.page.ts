import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';

@Component({
	selector: 'app-profile-page',
	standalone: true,
	imports: [ProfileComponent, BottomNavigationComponent],
	template: `
		<app-profile></app-profile>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ProfilePageComponent {}
