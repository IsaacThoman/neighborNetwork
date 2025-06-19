import { Component } from '@angular/core';
import { ConnectionsComponent } from './connections/connections.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';

@Component({
	selector: 'app-connections-page',
	standalone: true,
	imports: [ConnectionsComponent, BottomNavigationComponent],
	template: `
		<app-connections></app-connections>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ConnectionsPageComponent {}
