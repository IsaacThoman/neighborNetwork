import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	user = {
		name: 'John Doe',
		role: 'Senior Software Engineer',
		department: 'Engineering',
		email: 'john.doe@company.com',
		bio: 'Passionate about building scalable web applications and mentoring junior developers. Always excited to collaborate on innovative projects.',
		avatar: '/redguy.png',
		connections: 42,
		interests: ['Angular', 'TypeScript', 'Machine Learning', 'Photography']
	};
}
