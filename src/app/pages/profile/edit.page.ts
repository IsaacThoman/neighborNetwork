import { Component } from '@angular/core';
import { EditProfileComponent } from '../edit-profile/edit-profile.component.ts';
import { BottomNavigationComponent } from '../../components/bottom-navigation/bottom-navigation.component.ts';

@Component({
	selector: 'app-edit-profile-page',
	standalone: true,
	imports: [EditProfileComponent, BottomNavigationComponent],
	template: `
		<app-edit-profile></app-edit-profile>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class EditProfilePageComponent {}
