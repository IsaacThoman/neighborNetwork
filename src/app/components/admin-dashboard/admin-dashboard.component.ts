import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.ts';
import { isUserComplete, User } from '../../types/user.types.ts';

@Component({
	selector: 'admin-dashboard',
	standalone: true,
	imports: [CommonModule],
	template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button 
              (click)="logout()"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
            <p class="text-3xl font-bold text-blue-600">{{ users.length }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Complete Profiles</h3>
            <p class="text-3xl font-bold text-green-600">{{ completeProfiles }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Incomplete Profiles</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ incompleteProfiles }}</p>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">All Users</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alias
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users; trackBy: trackByAlias">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ user.alias }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.name || 'Not set' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.role || 'Not set' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.hubLocation || 'Not set' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(user)">
                      {{ isProfileComplete(user) ? 'Complete' : 'Incomplete' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      *ngIf="user.alias !== 'admin'"
                      (click)="deleteUser(user.alias)"
                      class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                      [disabled]="deletingUsers.has(user.alias)"
                    >
                      <span *ngIf="!deletingUsers.has(user.alias)">✕ Delete</span>
                      <span *ngIf="deletingUsers.has(user.alias)">Deleting...</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="px-6 py-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-500">Loading users...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && users.length === 0" class="px-6 py-8 text-center">
            <p class="text-gray-500">No users found.</p>
          </div>
        </div>
      </div>
    </div>
  `,
	styles: [`
    .status-complete {
      @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800;
    }
    .status-incomplete {
      @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800;
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
	users: User[] = [];
	loading = true;
	deletingUsers = new Set<string>();

	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	ngOnInit() {
		this.loadUsers();
	}

	async loadUsers() {
		try {
			console.log('Admin dashboard: Starting to load users...');
			this.loading = true;

			// Add timeout to prevent infinite loading
			const timeoutPromise = new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error('Request timeout')), 10000)
			);

			const usersPromise = this.authService.getAllUsers();

			this.users = await Promise.race([usersPromise, timeoutPromise]);
			console.log('Admin dashboard: Loaded users:', this.users);

			// Ensure users is always an array
			if (!Array.isArray(this.users)) {
				this.users = [];
			}
		} catch (error) {
			console.error('Error loading users:', error);
			this.loading = false; // Make sure loading is set to false on error
			const errorMessage = error instanceof Error ? error.message : String(error);
			alert(`Failed to load users: ${errorMessage}. Please check the console for more details.`);
		} finally {
			this.loading = false;
		}
	}

	async deleteUser(alias: string) {
		if (!confirm(`Are you sure you want to delete user "${alias}"? This action cannot be undone.`)) {
			return;
		}

		try {
			this.deletingUsers.add(alias);
			const success = await this.authService.deleteUser(alias);

			if (success) {
				this.users = this.users.filter((user) => user.alias !== alias);
			} else {
				alert('Failed to delete user. Please try again.');
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			alert('Error occurred while deleting user. Please try again.');
		} finally {
			this.deletingUsers.delete(alias);
		}
	}

	isProfileComplete(user: User): boolean {
		return isUserComplete(user);
	}

	getStatusClass(user: User): string {
		return this.isProfileComplete(user) ? 'status-complete' : 'status-incomplete';
	}

	get completeProfiles(): number {
		return this.users.filter((user) => this.isProfileComplete(user)).length;
	}

	get incompleteProfiles(): number {
		return this.users.filter((user) => !this.isProfileComplete(user)).length;
	}

	trackByAlias(_index: number, user: User): string {
		return user.alias;
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}
}
