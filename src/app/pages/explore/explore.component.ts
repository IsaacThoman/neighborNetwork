import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component.ts';
import { FilterCriteria, FiltersComponent } from '../../components/filters/filters.component.ts';
import { Profile, ProfileCardComponent } from '../../components/profile-card/profile-card.component.ts';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component.ts';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component.ts';
import { AuthService } from '../../services/auth.service.ts';
import { User } from '../../types/user.types.ts';

@Component({
	selector: 'app-explore',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		HeaderComponent,
		FiltersComponent,
		ProfileCardComponent,
		ActionButtonsComponent,
		EmptyStateComponent,
	],
	templateUrl: './explore.component.html',
	styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit, AfterViewInit, OnDestroy {
	profiles: Profile[] = [];
	filteredProfiles: Profile[] = [];
	currentProfileIndex = 0;
	currentProfile: Profile | null = null;
	isAnimating = false;
	swipeDirection: 'left' | 'right' | null = null;
	showInstructions = true;
	showFilters = false;
	currentUser: User | null = null;
	private keydownListener?: (event: KeyboardEvent) => void;

	// Filter properties
	filters: FilterCriteria = {
		department: '',
		yearsRange: '',
		location: '',
		workStyle: '',
	};

	// Touch gesture properties
	private touchStartX = 0;
	private touchStartY = 0;
	swipeOffset = 0;
	rotateAngle = 0;
	private isDragging = false;

	// Make Math available in template
	Math = Math;

	constructor(
		private cdr: ChangeDetectorRef,
		private http: HttpClient,
		private router: Router,
		private authService: AuthService,
	) {}

	ngOnInit() {
		// Check authentication
		this.currentUser = this.authService.getCurrentUser();
		if (!this.currentUser) {
			this.router.navigate(['/login']);
			return;
		}

		if (!this.authService.isUserProfileComplete()) {
			this.router.navigate(['/profile-edit']);
			return;
		}

		this.loadProfiles();
		this.setupKeyboardListeners();

		// Hide instructions after a few seconds
		setTimeout(() => {
			this.showInstructions = false;
			this.cdr.detectChanges();
		}, 3000);
	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
		if (this.keydownListener) {
			document.removeEventListener('keydown', this.keydownListener);
		}
	}

	private setupKeyboardListeners() {
		this.keydownListener = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				this.passProfile();
			} else if (event.key === 'ArrowRight') {
				this.connectProfile();
			}
		};
		document.addEventListener('keydown', this.keydownListener);
	}

	private loadProfiles() {
		this.http.get<Profile[]>('/api/profiles').subscribe({
			next: (profiles) => {
				this.profiles = profiles;
				this.filteredProfiles = [...profiles];
				this.updateCurrentProfile();
			},
			error: (error) => {
				console.error('Error loading profiles:', error);
			},
		});
	}

	private updateCurrentProfile() {
		if (this.currentProfileIndex < this.filteredProfiles.length) {
			this.currentProfile = this.filteredProfiles[this.currentProfileIndex];
		} else {
			this.currentProfile = null;
		}
	}

	toggleFilters() {
		this.showFilters = !this.showFilters;
	}

	onFiltersChange(newFilters: FilterCriteria) {
		this.filters = newFilters;
		this.applyFilters();
	}

	applyFilters() {
		this.filteredProfiles = this.profiles.filter((profile) => {
			// Department filter
			if (this.filters.department && profile.department !== this.filters.department) {
				return false;
			}

			// Years range filter
			if (this.filters.yearsRange) {
				const years = profile.yearsAtCompany;
				switch (this.filters.yearsRange) {
					case '1-3':
						if (years < 1 || years > 3) return false;
						break;
					case '4-6':
						if (years < 4 || years > 6) return false;
						break;
					case '7+':
						if (years < 7) return false;
						break;
				}
			}

			// Location filter
			if (this.filters.location && profile.location !== this.filters.location) {
				return false;
			}

			// Work style filter
			if (this.filters.workStyle && profile.workStyle !== this.filters.workStyle) {
				return false;
			}

			return true;
		});

		// Reset current profile index and update current profile
		this.currentProfileIndex = 0;
		this.updateCurrentProfile();
	}

	clearFilters() {
		this.filters = {
			department: '',
			yearsRange: '',
			location: '',
			workStyle: '',
		};
		this.applyFilters();
	}

	passProfile() {
		if (!this.currentProfile || this.isAnimating) return;

		this.animateSwipe('left', () => {
			this.currentProfileIndex++;
			this.updateCurrentProfile();
		});
	}

	connectProfile() {
		if (!this.currentProfile || this.isAnimating) return;

		this.animateSwipe('right', () => {
			// Here you would typically send a connection request to the backend
			console.log(`Connected with ${this.currentProfile?.name}`);
			this.currentProfileIndex++;
			this.updateCurrentProfile();
		});
	}

	private animateSwipe(direction: 'left' | 'right', callback: () => void) {
		this.isAnimating = true;
		this.swipeDirection = direction;

		setTimeout(() => {
			callback();
			this.isAnimating = false;
			this.swipeDirection = null;
			this.swipeOffset = 0;
			this.rotateAngle = 0;
			this.cdr.detectChanges();
		}, 300);
	}

	// Touch gesture handlers
	onTouchStart(event: TouchEvent) {
		if (this.isAnimating) return;

		this.touchStartX = event.touches[0].clientX;
		this.touchStartY = event.touches[0].clientY;
		this.isDragging = true;
	}

	onTouchMove(event: TouchEvent) {
		if (!this.isDragging || this.isAnimating) return;

		event.preventDefault();
		const currentX = event.touches[0].clientX;
		const currentY = event.touches[0].clientY;

		const deltaX = currentX - this.touchStartX;
		const deltaY = currentY - this.touchStartY;

		// Only handle horizontal swipes
		if (Math.abs(deltaY) > Math.abs(deltaX)) return;

		this.swipeOffset = deltaX;
		this.rotateAngle = deltaX * 0.1; // Slight rotation effect
		this.cdr.detectChanges();
	}

	onTouchEnd(_event: TouchEvent) {
		if (!this.isDragging || this.isAnimating) return;

		this.isDragging = false;
		const threshold = 100; // Minimum swipe distance

		if (this.swipeOffset > threshold) {
			// Swipe right - connect
			this.connectProfile();
		} else if (this.swipeOffset < -threshold) {
			// Swipe left - pass
			this.passProfile();
		} else {
			// Snap back to center
			this.swipeOffset = 0;
			this.rotateAngle = 0;
			this.cdr.detectChanges();
		}
	}
}
