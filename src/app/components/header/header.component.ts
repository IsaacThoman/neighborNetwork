import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.ts';

@Component({
	selector: 'app-header',
	standalone: true,
	templateUrl: './header.component.html',
	imports: [CommonModule],
})
export class HeaderComponent {
	@Output()
	toggleFilters = new EventEmitter<void>();

	@Input()
	showFilters = true;

	@Input()
	userAlias?: string;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	onToggleFilters() {
		this.toggleFilters.emit();
	}

	onLogout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}
}
