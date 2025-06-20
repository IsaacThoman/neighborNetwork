import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.ts';
import { User } from '../../types/user.types.ts';

interface Message {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: Date;
	isRead: boolean;
}

interface ChatUser {
	id: string;
	name: string;
	avatar: string;
	isOnline: boolean;
	isTyping: boolean;
}

@Component({
	selector: 'app-chat-conversation',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './chat-conversation.component.html',
	styleUrls: ['./chat-conversation.component.css']
})
export class ChatConversationComponent implements OnInit, OnDestroy, AfterViewChecked {
	@Input() chatId!: string;
	@ViewChild('messagesContainer') messagesContainer!: ElementRef;
	@ViewChild('messageInput') messageInput!: ElementRef;

	currentUser: User | null = null;
	chatUser: ChatUser | null = null;
	messages: Message[] = [];
	newMessage = '';
	isTyping = false;
	typingTimeout: number | null = null;

	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.currentUser = this.authService.getCurrentUser();
		this.loadChatData();
		this.loadMessages();
	}

	ngOnDestroy() {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
	}

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	loadChatData() {
		// Mock data based on chatId - in real app, fetch from API
		const mockChats = [
			{
				id: '1',
				name: 'Sarah Johnson',
				avatar: '/redguy.png',
				isOnline: true,
				isTyping: false
			},
			{
				id: '2',
				name: 'Mike Chen',
				avatar: '/yellowguy.webp',
				isOnline: false,
				isTyping: false
			},
			{
				id: '3',
				name: 'Emily Rodriguez',
				avatar: '/redguy.png',
				isOnline: true,
				isTyping: true
			},
			{
				id: '4',
				name: 'David Kim',
				avatar: '/yellowguy.webp',
				isOnline: true,
				isTyping: false
			},
			{
				id: '5',
				name: 'Lisa Thompson',
				avatar: '/redguy.png',
				isOnline: false,
				isTyping: false
			}
		];

		this.chatUser = mockChats.find(chat => chat.id === this.chatId) || mockChats[0];
	}

	loadMessages() {
		// Mock messages - in real app, fetch from API
		const mockMessages: { [key: string]: Message[] } = {
			'1': [
				{
					id: 'm1',
					senderId: '1',
					senderName: 'Sarah Johnson',
					content: 'Hey! Are you free for a quick call about the new design system?',
					timestamp: new Date(Date.now() - 120000), // 2 minutes ago
					isRead: false
				},
				{
					id: 'm2',
					senderId: '1',
					senderName: 'Sarah Johnson',
					content: 'I have some ideas that might help streamline our workflow',
					timestamp: new Date(Date.now() - 60000), // 1 minute ago
					isRead: false
				}
			],
			'2': [
				{
					id: 'm3',
					senderId: this.currentUser?.alias || 'current',
					senderName: this.currentUser?.name || 'You',
					content: 'Thanks for the feedback on the product roadmap!',
					timestamp: new Date(Date.now() - 3600000), // 1 hour ago
					isRead: true
				},
				{
					id: 'm4',
					senderId: '2',
					senderName: 'Mike Chen',
					content: 'No problem! Looking forward to the next iteration',
					timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
					isRead: true
				}
			]
		};

		this.messages = mockMessages[this.chatId] || [];
		this.markMessagesAsRead();
	}

	sendMessage() {
		if (!this.newMessage.trim() || !this.currentUser) return;

		const message: Message = {
			id: Date.now().toString(),
			senderId: this.currentUser.alias,
			senderName: this.currentUser.name || 'Unknown User',
			content: this.newMessage.trim(),
			timestamp: new Date(),
			isRead: false
		};

		this.messages.push(message);
		this.newMessage = '';

		// In real app, send to backend via WebSocket or HTTP
		// this.sendMessageToServer(message);

		// Simulate response after a delay
		setTimeout(() => {
			this.simulateResponse();
		}, 1000 + Math.random() * 2000);
	}

	simulateResponse() {
		if (!this.chatUser) return;

		const responses = [
			"That sounds great!",
			"I'll take a look at that.",
			"Thanks for sharing!",
			"Let me think about it.",
			"Perfect timing!",
			"I agree with that approach.",
			"Can we schedule a quick call?",
			"I'll get back to you soon."
		];

		const randomResponse = responses[Math.floor(Math.random() * responses.length)];

		const response: Message = {
			id: Date.now().toString(),
			senderId: this.chatUser.id,
			senderName: this.chatUser.name,
			content: randomResponse,
			timestamp: new Date(),
			isRead: false
		};

		this.messages.push(response);
	}

	onTyping() {
		// In real app, emit typing event via WebSocket
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}

		this.typingTimeout = setTimeout(() => {
			this.isTyping = false;
		}, 1000);
	}

	markMessagesAsRead() {
		this.messages.forEach(message => {
			if (message.senderId !== this.currentUser?.alias) {
				message.isRead = true;
			}
		});
	}

	goBack() {
		this.router.navigate(['/chats']);
	}

	isMyMessage(message: Message): boolean {
		return message.senderId === this.currentUser?.alias;
	}

	formatTime(timestamp: Date): string {
		return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	formatDate(timestamp: Date): string {
		const today = new Date();
		const messageDate = new Date(timestamp);
		
		if (messageDate.toDateString() === today.toDateString()) {
			return 'Today';
		}
		
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		
		if (messageDate.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		}
		
		return messageDate.toLocaleDateString();
	}

	shouldShowDateSeparator(index: number): boolean {
		if (index === 0) return true;
		
		const currentMessage = this.messages[index];
		const previousMessage = this.messages[index - 1];
		
		const currentDate = new Date(currentMessage.timestamp).toDateString();
		const previousDate = new Date(previousMessage.timestamp).toDateString();
		
		return currentDate !== previousDate;
	}

	private scrollToBottom() {
		try {
			if (this.messagesContainer) {
				this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
			}
		} catch (err) {
			console.error('Error scrolling to bottom:', err);
		}
	}

	onKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			this.sendMessage();
		}
	}
}
