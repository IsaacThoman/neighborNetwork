import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-home',
	standalone: true,
	template: `
		<h1>app works >:)</h1>`,
	styles: ``,
	imports: [CommonModule],
})
export default class HomeComponent implements AfterViewInit {
	constructor(private cdr: ChangeDetectorRef) {}

	ngAfterViewInit() {
	}
}
