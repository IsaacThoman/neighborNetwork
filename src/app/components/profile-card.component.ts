import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Profile {
	id: number;
	name: string;
	pronouns: string;
	department: string;
	role: string;
	yearsAtCompany: number;
	location: string;
	workStyle: string;
	bio: string;
	profileImage: string;
	interests: string[];
}

@Component({
	selector: 'app-profile-card',
	standalone: true,
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.css',
	imports: [CommonModule],
})
export class ProfileCardComponent {
	@Input()
	profile!: Profile;
	@Input()
	isAnimating = false;
	@Input()
	swipeDirection: 'left' | 'right' | null = null;
	@Input()
	swipeOffset = 0;
	@Input()
	rotateAngle = 0;

	@Output()
	touchStart = new EventEmitter<TouchEvent>();
	@Output()
	touchMove = new EventEmitter<TouchEvent>();
	@Output()
	touchEnd = new EventEmitter<TouchEvent>();

	// Make Math available in template
	Math = Math;

	onTouchStart(event: TouchEvent) {
		this.touchStart.emit(event);
	}

	onTouchMove(event: TouchEvent) {
		this.touchMove.emit(event);
	}

	onTouchEnd(event: TouchEvent) {
		this.touchEnd.emit(event);
	}
}
