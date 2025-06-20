import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component.ts';
import { FilterCriteria, FiltersComponent } from '../../components/filters/filters.component.ts';
import { AuthService } from '../../services/auth.service.ts';
import { User } from '../../types/user.types.ts';

interface Chat {
	id: number;
	name: string;
	avatar: string;
	lastMessage: string;
	timestamp: string;
	unreadCount: number;
	isTyping?: boolean;
	// Filter-related properties
	department?: string;
	location?: string;
	workStyle?: string;
	yearsExperience?: number;
}

@Component({
	selector: 'app-chats',
	standalone: true,
	imports: [CommonModule, FormsModule, HeaderComponent, FiltersComponent],
	templateUrl: './chats.component.html',
	styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
	searchTerm = '';
	showFilters = false;
	currentUser: User | null = null;

	constructor(private authService: AuthService) {}

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

	chats: Chat[] = [
		{
			id: 1,
			name: 'Sarah Johnson',
			avatar: '/redguy.png',
			lastMessage: 'Hey! Are you free for a quick call about the new design system?',
			timestamp: '2m ago',
			unreadCount: 2,
			isTyping: false,
			department: 'Design',
			location: 'San Francisco',
			workStyle: 'remote',
			yearsExperience: 5
		},
		{
			id: 2,
			name: 'Mike Chen',
			avatar: '/yellowguy.webp',
			lastMessage: 'Thanks for the feedback on the product roadmap!',
			timestamp: '1h ago',
			unreadCount: 0,
			department: 'Product',
			location: 'San Francisco',
			workStyle: 'hybrid',
			yearsExperience: 3
		},
		{
			id: 3,
			name: 'Emily Rodriguez',
			avatar: '/redguy.png',
			lastMessage: 'The data analysis looks great. Can we schedule a review?',
			timestamp: '3h ago',
			unreadCount: 1,
			isTyping: true,
			department: 'Analytics',
			location: 'New York',
			workStyle: 'office',
			yearsExperience: 7
		},
		{
			id: 4,
			name: 'David Kim',
			avatar: '/yellowguy.webp',
			lastMessage: 'I pushed the latest changes to the feature branch.',
			timestamp: 'Yesterday',
			unreadCount: 0,
			department: 'Engineering',
			location: 'San Francisco',
			workStyle: 'remote',
			yearsExperience: 4
		},
		{
			id: 5,
			name: 'Lisa Thompson',
			avatar: '/redguy.png',
			lastMessage: 'Great work on the campaign launch! 🎉',
			timestamp: '2 days ago',
			unreadCount: 0,
			department: 'Marketing',
			location: 'Austin',
			workStyle: 'hybrid',
			yearsExperience: 6
		}
	];

	get filteredChats() {
		let filtered = this.chats;

		// Filter by search term
		if (this.searchTerm) {
			filtered = filtered.filter(chat =>
				chat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
				chat.lastMessage.toLowerCase().includes(this.searchTerm.toLowerCase())
			);
		}

		// Apply filters
		if (this.filters.department) {
			filtered = filtered.filter(chat => 
				chat.department?.toLowerCase() === this.filters.department.toLowerCase()
			);
		}

		if (this.filters.location) {
			filtered = filtered.filter(chat => 
				chat.location?.toLowerCase().includes(this.filters.location.toLowerCase())
			);
		}

		if (this.filters.workStyle) {
			filtered = filtered.filter(chat => 
				chat.workStyle?.toLowerCase() === this.filters.workStyle.toLowerCase()
			);
		}

		if (this.filters.yearsRange) {
			const [min, max] = this.filters.yearsRange.split('-').map(n => parseInt(n));
			if (!isNaN(min) && !isNaN(max)) {
				filtered = filtered.filter(chat => {
					const years = chat.yearsExperience || 0;
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

	openChat(chat: Chat) {
		console.log('Opening chat with:', chat.name);
		// Navigate to individual chat or open chat modal
		// For now, just mark as read
		chat.unreadCount = 0;
	}

	getTotalUnreadCount(): number {
		return this.chats.reduce((total, chat) => total + chat.unreadCount, 0);
	}
}
