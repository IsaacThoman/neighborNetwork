import { Component } from '@angular/core';
import { ExploreComponent } from './explore/explore.component.ts';
import { BottomNavigationComponent } from '../components/bottom-navigation/bottom-navigation.component.ts';

@Component({
	selector: 'app-explore-page',
	standalone: true,
	imports: [ExploreComponent, BottomNavigationComponent],
	template: `
		<app-explore></app-explore>
		<app-bottom-navigation></app-bottom-navigation>
	`
})
export default class ExplorePageComponent {}
