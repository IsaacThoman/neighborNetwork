import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Chat {
	id: number;
	name: string;
	avatar: string;
	lastMessage: string;
	timestamp: string;
	unreadCount: number;
	isOnline: boolean;
	isTyping?: boolean;
}

@Component({
	selector: 'app-chats',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './chats.component.html',
	styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
	searchTerm = '';

	chats: Chat[] = [
		{
			id: 1,
			name: 'Sarah Johnson',
			avatar: '/redguy.png',
			lastMessage: 'Hey! Are you free for a quick call about the new design system?',
			timestamp: '2m ago',
			unreadCount: 2,
			isOnline: true,
			isTyping: false
		},
		{
			id: 2,
			name: 'Mike Chen',
			avatar: '/yellowguy.webp',
			lastMessage: 'Thanks for the feedback on the product roadmap!',
			timestamp: '1h ago',
			unreadCount: 0,
			isOnline: false
		},
		{
			id: 3,
			name: 'Emily Rodriguez',
			avatar: '/redguy.png',
			lastMessage: 'The data analysis looks great. Can we schedule a review?',
			timestamp: '3h ago',
			unreadCount: 1,
			isOnline: true,
			isTyping: true
		},
		{
			id: 4,
			name: 'David Kim',
			avatar: '/yellowguy.webp',
			lastMessage: 'I pushed the latest changes to the feature branch.',
			timestamp: 'Yesterday',
			unreadCount: 0,
			isOnline: true
		},
		{
			id: 5,
			name: 'Lisa Thompson',
			avatar: '/redguy.png',
			lastMessage: 'Great work on the campaign launch! 🎉',
			timestamp: '2 days ago',
			unreadCount: 0,
			isOnline: false
		}
	];

	get filteredChats() {
		if (!this.searchTerm) {
			return this.chats;
		}

		return this.chats.filter(chat =>
			chat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
			chat.lastMessage.toLowerCase().includes(this.searchTerm.toLowerCase())
		);
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
