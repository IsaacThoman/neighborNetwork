import { Component } from '@angular/core';
import { ChatsComponent } from './chats/chats.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';

@Component({
	selector: 'app-chats-page',
	standalone: true,
	imports: [ChatsComponent, BottomNavigationComponent],
	template: `
		<app-chats></app-chats>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ChatsPageComponent {}
