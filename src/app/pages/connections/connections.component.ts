import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Connection {
	id: number;
	name: string;
	role: string;
	department: string;
	avatar: string;
	status: 'online' | 'offline' | 'away';
	lastSeen?: string;
	mutualConnections: number;
}

@Component({
	selector: 'app-connections',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './connections.component.html',
	styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent {
	searchTerm = '';
	selectedFilter = 'all';

	connections: Connection[] = [
		{
			id: 1,
			name: 'Sarah Johnson',
			role: 'UX Designer',
			department: 'Design',
			avatar: '/redguy.png',
			status: 'online',
			mutualConnections: 12
		},
		{
			id: 2,
			name: 'Mike Chen',
			role: 'Product Manager',
			department: 'Product',
			avatar: '/yellowguy.webp',
			status: 'away',
			mutualConnections: 8
		},
		{
			id: 3,
			name: 'Emily Rodriguez',
			role: 'Data Scientist',
			department: 'Analytics',
			avatar: '/redguy.png',
			status: 'offline',
			lastSeen: '2 hours ago',
			mutualConnections: 15
		},
		{
			id: 4,
			name: 'David Kim',
			role: 'Frontend Developer',
			department: 'Engineering',
			avatar: '/yellowguy.webp',
			status: 'online',
			mutualConnections: 23
		},
		{
			id: 5,
			name: 'Lisa Thompson',
			role: 'Marketing Manager',
			department: 'Marketing',
			avatar: '/redguy.png',
			status: 'offline',
			lastSeen: '1 day ago',
			mutualConnections: 6
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

		// Filter by status
		if (this.selectedFilter !== 'all') {
			filtered = filtered.filter(connection => connection.status === this.selectedFilter);
		}

		return filtered;
	}

	getStatusText(connection: Connection): string {
		switch (connection.status) {
			case 'online':
				return 'Online';
			case 'away':
				return 'Away';
			case 'offline':
				return connection.lastSeen ? `Last seen ${connection.lastSeen}` : 'Offline';
			default:
				return '';
		}
	}

	messageConnection(connection: Connection) {
		console.log('Starting chat with:', connection.name);
		// Navigate to chat or open chat modal
	}
}
