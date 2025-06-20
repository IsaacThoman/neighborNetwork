import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isUserComplete, User } from '../types/user.types.ts';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private currentUserSubject = new BehaviorSubject<User | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	constructor() {
		// Check for existing session
		this.checkExistingSession();
	}

	private async checkExistingSession() {
		const storedAlias = localStorage.getItem('userAlias');
		if (storedAlias) {
			try {
				await this.loadUserFromServer(storedAlias);
			} catch (error) {
				console.error('Failed to load user from server:', error);
				// Clear invalid session
				this.logout();
			}
		}
	}

	private async loadUserFromServer(alias: string): Promise<User> {
		const response = await fetch(`/api/users/${alias}`);

		if (response.ok) {
			const user = await response.json();
			this.currentUserSubject.next(user);
			this.isAuthenticatedSubject.next(true);
			return user;
		} else {
			throw new Error('Failed to load user from server');
		}
	}

	async login(alias: string): Promise<{ user: User; isNewUser: boolean }> {
		try {
			// First check if user exists
			const response = await fetch(`/api/users/${alias}`);

			if (response.ok) {
				const user = await response.json();
				this.setCurrentUser(user);
				return { user, isNewUser: false };
			} else if (response.status === 404) {
				// Create new user
				const newUser: User = {
					alias,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				const createResponse = await fetch('/api/users', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newUser),
				});

				if (createResponse.ok) {
					const createdUser = await createResponse.json();
					this.setCurrentUser(createdUser);
					return { user: createdUser, isNewUser: true };
				} else {
					throw new Error('Failed to create user');
				}
			} else {
				throw new Error('Login failed');
			}
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	}

	logout() {
		localStorage.removeItem('userAlias');
		this.currentUserSubject.next(null);
		this.isAuthenticatedSubject.next(false);
	}

	private setCurrentUser(user: User) {
		// Only store the alias in localStorage
		localStorage.setItem('userAlias', user.alias);
		this.currentUserSubject.next(user);
		this.isAuthenticatedSubject.next(true);
	}

	getCurrentUser(): User | null {
		return this.currentUserSubject.value;
	}

	getStoredAlias(): string | null {
		return localStorage.getItem('userAlias');
	}

	async refreshUserData(): Promise<User | null> {
		const alias = this.getStoredAlias();
		if (!alias) {
			return null;
		}

		try {
			return await this.loadUserFromServer(alias);
		} catch (error) {
			console.error('Failed to refresh user data:', error);
			this.logout();
			return null;
		}
	}

	isUserProfileComplete(): boolean {
		const user = this.getCurrentUser();
		return user ? isUserComplete(user) : false;
	}

	async updateUser(updates: Partial<User>): Promise<User> {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			throw new Error('No user logged in');
		}

		try {
			const response = await fetch(`/api/users/${currentUser.alias}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...currentUser,
					...updates,
					updatedAt: new Date(),
				}),
			});

			if (response.ok) {
				const updatedUser = await response.json();
				// Update the user in memory and refresh from server to ensure consistency
				this.currentUserSubject.next(updatedUser);
				return updatedUser;
			} else {
				throw new Error('Failed to update user');
			}
		} catch (error) {
			console.error('Update user error:', error);
			throw error;
		}
	}

	async getAllUsers(): Promise<User[]> {
		try {
			console.log('AuthService: Making request to /api/users');
			const response = await fetch('/api/users');
			console.log('AuthService: Response status:', response.status);

			if (response.ok) {
				const users = await response.json();
				console.log('AuthService: Received users:', users);
				return users;
			} else {
				const errorText = await response.text();
				console.error('AuthService: Error response:', errorText);
				throw new Error(`Failed to get users: ${response.status} ${errorText}`);
			}
		} catch (error) {
			console.error('Get all users error:', error);
			throw error;
		}
	}

	async deleteUser(alias: string): Promise<boolean> {
		try {
			const response = await fetch(`/api/users/${alias}`, {
				method: 'DELETE',
			});
			return response.ok;
		} catch (error) {
			console.error('Delete user error:', error);
			throw error;
		}
	}

	isAdmin(): boolean {
		const user = this.getCurrentUser();
		return user?.alias === 'admin';
	}
}
