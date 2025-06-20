import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service.ts';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Logo and Title -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-2xl">SF</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to Neighbor Network</h1>
            <p class="text-gray-600">Enter your alias to get started</p>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="mb-6">
              <label for="alias" class="block text-sm font-medium text-gray-700 mb-2">
                Alias
              </label>
              <input
                type="text"
                id="alias"
                name="alias"
                [(ngModel)]="alias"
                required
                minlength="2"
                maxlength="50"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Enter your alias"
                [disabled]="isLoading"
              >
              <div *ngIf="loginForm.submitted && loginForm.controls['alias']?.invalid" class="mt-1 text-sm text-red-600">
                <div *ngIf="loginForm.controls['alias']?.errors?.['required']">Alias is required</div>
                <div *ngIf="loginForm.controls['alias']?.errors?.['minlength']">Alias must be at least 2 characters</div>
                <div *ngIf="loginForm.controls['alias']?.errors?.['maxlength']">Alias must be less than 50 characters</div>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoading || loginForm.invalid"
              class="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
              <span *ngIf="!isLoading">Continue</span>
            </button>
          </form>

          <!-- Help Text -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              New to Neighbor Network? Don't worry - we'll create your profile automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class LoginComponent {
	alias = '';
	isLoading = false;
	errorMessage = '';

	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	async onSubmit() {
		if (!this.alias.trim()) {
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';

		try {
			const { user, isNewUser: _isNewUser } = await this.authService.login(this.alias.trim());

			// Check if user is admin
			if (user.alias === 'ADMIN') {
				this.router.navigate(['/admin']);
				return;
			}

			if (!this.authService.isUserProfileComplete()) {
				// Redirect to profile edit if user is incomplete
				this.router.navigate(['/profile-edit']);
			} else {
				// Redirect to explore page if user is complete
				this.router.navigate(['/explore']);
			}
		} catch (error) {
			console.error('Login failed:', error);
			this.errorMessage = 'Login failed. Please try again.';
		} finally {
			this.isLoading = false;
		}
	}
}
