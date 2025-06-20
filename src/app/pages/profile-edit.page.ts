import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service.ts';
import { User, ROLES } from '../types/user.types.ts';
import { HeaderComponent } from '../components/header/header.component.ts';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <!-- Header with alias display -->
      <div class="bg-white shadow-sm border-b border-red-200">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">SF</span>
              </div>
              <h1 class="text-xl font-bold text-gray-900">Connect</h1>
              <span class="text-sm text-gray-500">• {{ currentUser?.alias }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-4 py-6">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            type="button"
            (click)="goBack()"
            class="text-red-600 hover:text-red-700 font-medium"
          >
            Cancel
          </button>
        </div>

        <!-- Profile Form -->
        <form (ngSubmit)="onSubmit()" #profileForm="ngForm" class="space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            
            <!-- Name Field -->
            <div class="mb-6">
              <label for="name" class="block text-base font-medium text-gray-700 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="formData.name"
                required
                maxlength="100"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your full name"
              >
              <div *ngIf="profileForm.submitted && profileForm.controls['name']?.invalid" class="mt-1 text-sm text-red-600">
                Name is required
              </div>
            </div>

            <!-- Role Field -->
            <div class="mb-6">
              <label for="role" class="block text-base font-medium text-gray-700 mb-2">
                Role <span class="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                [(ngModel)]="formData.role"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select a role</option>
                <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
              </select>
              <div *ngIf="profileForm.submitted && profileForm.controls['role']?.invalid" class="mt-1 text-sm text-red-600">
                Role is required
              </div>
            </div>

            <!-- Bio Field -->
            <div class="mb-6">
              <label for="bio" class="block text-base font-medium text-gray-700 mb-2">
                Bio <span class="text-xs text-gray-500">(minimum 20 characters)</span> <span class="text-red-500">*</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                [(ngModel)]="formData.bio"
                required
                minlength="20"
                maxlength="500"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="Tell us about yourself, your interests, and what you're looking to connect about..."
              ></textarea>
              <div class="flex justify-between mt-1">
                <div *ngIf="profileForm.submitted && profileForm.controls['bio']?.invalid" class="text-sm text-red-600">
                  <div *ngIf="profileForm.controls['bio']?.errors?.['required']">Bio is required</div>
                  <div *ngIf="profileForm.controls['bio']?.errors?.['minlength']">Bio must be at least 20 characters</div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ (formData.bio || '').length }}/500<span *ngIf="(formData.bio || '').length < 20" class="text-red-500"> • {{ 20 - (formData.bio || '').length }} characters left</span>
                </div>
              </div>
            </div>

            <!-- Hub Location Field -->
            <div class="mb-6">
              <label for="hubLocation" class="block text-base font-medium text-gray-700 mb-2">
                Hub Location
              </label>
              <input
                type="text"
                id="hubLocation"
                name="hubLocation"
                [(ngModel)]="formData.hubLocation"
                maxlength="100"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="e.g., Bloomington, IL"
              >
            </div>

            <!-- Years at State Farm -->
            <div class="mb-6">
              <label for="yearsAtStateFarm" class="block text-base font-medium text-gray-700 mb-2">
                Years at State Farm
              </label>
              <input
                type="number"
                id="yearsAtStateFarm"
                name="yearsAtStateFarm"
                [(ngModel)]="formData.yearsAtStateFarm"
                min="0"
                max="50"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="e.g., 3"
              >
            </div>

            <!-- Areas of Interest -->
            <div class="mb-6">
              <label for="areasOfInterest" class="block text-base font-medium text-gray-700 mb-2">
                Areas of Interest
                <span class="text-xs text-gray-500">(separate with commas)</span>
              </label>
              <input
                type="text"
                id="areasOfInterest"
                name="areasOfInterest"
                [(ngModel)]="areasOfInterestString"
                maxlength="300"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="e.g., Cloud Architecture, Mentorship, Innovation Labs"
              >
              <div class="mt-1 text-xs text-gray-500">
                Enter topics you're interested in or want to connect about, separated by commas
              </div>
            </div>

          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <button
              type="submit"
              [disabled]="isLoading || profileForm.invalid"
              class="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span *ngIf="!isLoading">Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export default class ProfileEditComponent implements OnInit {
  currentUser: User | null = null;
  formData: Partial<User> = {};
  areasOfInterestString = '';
  roles = ROLES;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Initialize form data
    this.formData = { ...this.currentUser };
    this.areasOfInterestString = this.currentUser.areasOfInterest?.join(', ') || '';
  }

  goBack() {
      if (this.authService.isUserProfileComplete()) {
        this.router.navigate(['/profile']);
      } else {
        // If profile is incomplete, don't let them go back
        this.router.navigate(['/explore']);
      }
  }

  async onSubmit() {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Process areas of interest
      const areasOfInterest = this.areasOfInterestString
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const updates: Partial<User> = {
        ...this.formData,
        areasOfInterest: areasOfInterest.length > 0 ? areasOfInterest : undefined
      };

      await this.authService.updateUser(updates);
      
      // Redirect based on profile completeness
      if (this.authService.isUserProfileComplete()) {
        this.router.navigate(['/profile']);
      } else {
        // Stay on edit page if still incomplete
        this.errorMessage = 'Please fill in all required fields to complete your profile.';
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      this.errorMessage = 'Failed to save profile. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
