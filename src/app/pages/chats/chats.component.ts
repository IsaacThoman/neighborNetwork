import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component.ts';
import { FilterCriteria, FiltersComponent } from '../../components/filters/filters.component.ts';
import { AuthService } from '../../services/auth.service.ts';
import { ChatService, Chat } from '../../services/chat.service.ts';
import { User } from '../../types/user.types.ts';

@Component({
	selector: 'app-chats',
	standalone: true,
	imports: [CommonModule, FormsModule, HeaderComponent, FiltersComponent],
	templateUrl: './chats.component.html',
	styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {
	searchTerm = '';
	showFilters = false;
	currentUser: User | null = null;
	chats: Chat[] = [];
	private chatsSubscription?: Subscription;

	constructor(
		private authService: AuthService,
		private chatService: ChatService,
		private router: Router
	) {}

	ngOnInit() {
		this.currentUser = this.authService.getCurrentUser();
		this.chatsSubscription = this.chatService.getChats().subscribe(chats => {
			this.chats = chats;
		});
	}

	ngOnDestroy() {
		this.chatsSubscription?.unsubscribe();
	}
	// Filter properties
	filters: FilterCriteria = {
		department: '',
		yearsRange: '',
		location: '',
		workStyle: '',
	};

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
		// Mark messages as read in the chat service
		if (this.currentUser?.alias) {
			this.chatService.markMessagesAsRead(chat.id.toString(), this.currentUser.alias);
		}
		// Navigate to individual chat screen
		this.router.navigate(['/chat', chat.id]);
	}

	getTotalUnreadCount(): number {
		return this.chats.reduce((total, chat) => total + chat.unreadCount, 0);
	}
}
