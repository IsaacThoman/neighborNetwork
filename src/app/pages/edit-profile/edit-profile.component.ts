import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-edit-profile',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
	user = {
		name: 'John Doe',
		role: 'Senior Software Engineer',
		department: 'Engineering',
		email: 'john.doe@company.com',
		bio: 'Passionate about building scalable web applications and mentoring junior developers. Always excited to collaborate on innovative projects.',
		avatar: '/redguy.png',
		interests: ['Angular', 'TypeScript', 'Machine Learning', 'Photography']
	};

	newInterest = '';

	constructor(private router: Router) {}

	addInterest() {
		if (this.newInterest.trim() && !this.user.interests.includes(this.newInterest.trim())) {
			this.user.interests.push(this.newInterest.trim());
			this.newInterest = '';
		}
	}

	removeInterest(interest: string) {
		this.user.interests = this.user.interests.filter(i => i !== interest);
	}

	saveProfile() {
		// Here you would typically save to a service/API
		console.log('Saving profile:', this.user);
		this.router.navigate(['/profile']);
	}

	cancel() {
		this.router.navigate(['/profile']);
	}
}
