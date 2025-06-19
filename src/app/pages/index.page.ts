import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-index',
	standalone: true,
	template: ``,
})
export default class IndexComponent {
	constructor(private router: Router) {
		this.router.navigate(['/explore']);
	}
}
