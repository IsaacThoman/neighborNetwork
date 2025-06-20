import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service.ts';
import { ChatService, Message, ChatUser } from '../../services/chat.service.ts';
import { User } from '../../types/user.types.ts';

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
		private location: Location,
		private authService: AuthService,
		private chatService: ChatService
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
		this.chatUser = this.chatService.getChatUser(this.chatId);
	}

	loadMessages() {
		this.messages = this.chatService.getMessages(this.chatId);
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

		// Add message through chat service
		this.chatService.addMessage(this.chatId, message);
		
		// Reload messages to get updated list
		this.messages = this.chatService.getMessages(this.chatId);
		
		this.newMessage = '';

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

		// Add response through chat service
		this.chatService.addMessage(this.chatId, response);
		
		// Reload messages to get updated list
		this.messages = this.chatService.getMessages(this.chatId);
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
		if (this.currentUser?.alias) {
			this.chatService.markMessagesAsRead(this.chatId, this.currentUser.alias);
			// Reload messages to get updated read status
			this.messages = this.chatService.getMessages(this.chatId);
		}
	}

	goBack() {
		this.location.back();
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
