import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template: `
		<div class="app-container">
			<router-outlet />
		</div>
	`,
	styles: [`
		.app-container {
			min-height: 100vh;
			padding-bottom: 80px; /* Space for bottom navigation */
		}
	`]
})
export class AppComponent {}
