import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-header',
	standalone: true,
	templateUrl: './header.component.html',
	imports: [CommonModule],
})
export class HeaderComponent {
	@Output()
	toggleFilters = new EventEmitter<void>();

	onToggleFilters() {
		this.toggleFilters.emit();
	}
}
