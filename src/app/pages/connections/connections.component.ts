import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component.ts';
import { FilterCriteria, FiltersComponent } from '../../components/filters/filters.component.ts';
import { AuthService } from '../../services/auth.service.ts';
import { User } from '../../types/user.types.ts';

interface Connection {
	id: number;
	name: string;
	role: string;
	department: string;
	avatar: string;
	mutualConnections: number;
	location?: string;
	yearsExperience?: number;
	workStyle?: string;
}

@Component({
	selector: 'app-connections',
	standalone: true,
	imports: [CommonModule, FormsModule, HeaderComponent, FiltersComponent],
	templateUrl: './connections.component.html',
	styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {
	searchTerm = '';
	showFilters = false;
	currentUser: User | null = null;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.currentUser = this.authService.getCurrentUser();
	}

	// Filter properties
	filters: FilterCriteria = {
		department: '',
		yearsRange: '',
		location: '',
		workStyle: '',
	};

	connections: Connection[] = [
		{
			id: 1,
			name: 'Isaac Thoman',
			role: 'UX Designer',
			department: 'Design',
			avatar: '/isaac.png',
			mutualConnections: 12,
			location: 'San Francisco',
			yearsExperience: 5,
			workStyle: 'remote'
		},
		{
			id: 2,
			name: 'Philip Nsajja',
			role: 'Product Manager',
			department: 'Product',
			avatar: '/philip.png',
			mutualConnections: 8,
			location: 'San Francisco',
			yearsExperience: 3,
			workStyle: 'hybrid'
		},
		{
			id: 3,
			name: 'Colin Chua',
			role: 'Data Scientist',
			department: 'Analytics',
			avatar: '/colin.webp',
			mutualConnections: 15,
			location: 'New York',
			yearsExperience: 7,
			workStyle: 'office'
		},
		{
			id: 4,
			name: 'Michael Carroll',
			role: 'Frontend Developer',
			department: 'Engineering',
			avatar: '/mac.png',
			mutualConnections: 23,
			location: 'San Francisco',
			yearsExperience: 4,
			workStyle: 'remote'
		}
	];

	get filteredConnections() {
		let filtered = this.connections;

		// Filter by search term
		if (this.searchTerm) {
			filtered = filtered.filter(connection =>
				connection.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
				connection.role.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
				connection.department.toLowerCase().includes(this.searchTerm.toLowerCase())
			);
		}

		// Apply filters
		if (this.filters.department) {
			filtered = filtered.filter(connection => 
				connection.department.toLowerCase() === this.filters.department.toLowerCase()
			);
		}

		if (this.filters.location) {
			filtered = filtered.filter(connection => 
				connection.location?.toLowerCase().includes(this.filters.location.toLowerCase())
			);
		}

		if (this.filters.workStyle) {
			filtered = filtered.filter(connection => 
				connection.workStyle?.toLowerCase() === this.filters.workStyle.toLowerCase()
			);
		}

		if (this.filters.yearsRange) {
			const [min, max] = this.filters.yearsRange.split('-').map(n => parseInt(n));
			if (!isNaN(min) && !isNaN(max)) {
				filtered = filtered.filter(connection => {
					const years = connection.yearsExperience || 0;
					return years >= min && years <= max;
				});
			}
		}

		return filtered;
	}

	toggleFilters() {
		this.showFilters = !this.showFilters;
	}

	onFiltersChange(newFilters: FilterCriteria) {
		this.filters = { ...newFilters };
	}

	clearFilters() {
		this.filters = {
			department: '',
			yearsRange: '',
			location: '',
			workStyle: '',
		};
	}

	messageConnection(connection: Connection) {
		console.log('Starting chat with:', connection.name);
		// Navigate to individual chat screen using the connection's ID
		this.router.navigate(['/chat', connection.id]);
	}
}
