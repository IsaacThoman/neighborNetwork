import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component.ts';
import { AuthService } from '../../services/auth.service.ts';
import { User, isUserComplete } from '../../types/user.types.ts';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, RouterModule, HeaderComponent],
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	user: User | null = null;

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.user = this.authService.getCurrentUser();
	}

	isProfileComplete(): boolean {
		return this.user ? isUserComplete(this.user) : false;
	}
}
