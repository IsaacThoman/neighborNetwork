import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: Date;
	isRead: boolean;
}

export interface Chat {
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

export interface ChatUser {
	id: string;
	name: string;
	avatar: string;
	isOnline: boolean;
	isTyping: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class ChatService {
	private chatsSubject = new BehaviorSubject<Chat[]>([]);
	private messagesSubject = new BehaviorSubject<{ [chatId: string]: Message[] }>({});

	constructor() {
		this.initializeData();
	}

	private initializeData() {
		// Initialize mock messages
		const mockMessages: { [key: string]: Message[] } = {
			'1': [
				{
					id: 'm1',
					senderId: '1',
					senderName: 'Isaac Thoman',
					content: 'Hey! Are you free for a quick call about the new design system?',
					timestamp: new Date(Date.now() - 120000), // 2 minutes ago
					isRead: false,
				},
				{
					id: 'm2',
					senderId: '1',
					senderName: 'Isaac Thoman',
					content: 'I have some ideas that might help streamline our workflow',
					timestamp: new Date(Date.now() - 60000), // 1 minute ago
					isRead: false,
				},
			],
			'2': [
				{
					id: 'm3',
					senderId: 'current',
					senderName: 'You',
					content: 'I think the roadmap looks solid. Great work on the analysis!',
					timestamp: new Date(Date.now() - 7200000), // 2 hours ago
					isRead: true,
				},
				{
					id: 'm4',
					senderId: '2',
					senderName: 'Philip Nsajja',
					content: 'Thanks for the feedback on the product roadmap!',
					timestamp: new Date(Date.now() - 3600000), // 1 hour ago
					isRead: true,
				},
			],
			'3': [
				{
					id: 'm5',
					senderId: 'current',
					senderName: 'You',
					content: 'Could you send me the latest numbers when you get a chance?',
					timestamp: new Date(Date.now() - 14400000), // 4 hours ago
					isRead: true,
				},
				{
					id: 'm6',
					senderId: '3',
					senderName: 'Colin Chua',
					content: 'The data analysis looks great. Can we schedule a review?',
					timestamp: new Date(Date.now() - 10800000), // 3 hours ago
					isRead: false,
				},
			],
			'4': [
				{
					id: 'm7',
					senderId: '4',
					senderName: 'Michael Carroll',
					content: 'I pushed the latest changes to the feature branch.',
					timestamp: new Date(Date.now() - 86400000), // Yesterday
					isRead: true,
				},
				{
					id: 'm8',
					senderId: 'current',
					senderName: 'You',
					content: "Perfect! I'll review the code this afternoon.",
					timestamp: new Date(Date.now() - 82800000), // Yesterday + 1 hour
					isRead: true,
				},
			],
		};

		this.messagesSubject.next(mockMessages);

		// Initialize chats with proper last messages
		const chats = this.generateChatsFromMessages(mockMessages);
		this.chatsSubject.next(chats);
	}

	private generateChatsFromMessages(messages: { [chatId: string]: Message[] }): Chat[] {
		const baseChats = [
			{
				id: 1,
				name: 'Isaac Thoman',
				avatar: '/isaac.png',
				department: 'Design',
				location: 'San Francisco',
				workStyle: 'remote',
				yearsExperience: 5,
			},
			{
				id: 2,
				name: 'Philip Nsajja',
				avatar: '/philip.png',
				department: 'Product',
				location: 'San Francisco',
				workStyle: 'hybrid',
				yearsExperience: 3,
			},
			{
				id: 3,
				name: 'Colin Chua',
				avatar: '/colin.webp',
				department: 'Analytics',
				location: 'New York',
				workStyle: 'office',
				yearsExperience: 7,
				isTyping: true,
			},
			{
				id: 4,
				name: 'Michael Carroll',
				avatar: '/mac.png',
				department: 'Engineering',
				location: 'San Francisco',
				workStyle: 'remote',
				yearsExperience: 4,
			},
		];

		return baseChats.map((chat) => {
			const chatMessages = messages[chat.id.toString()] || [];
			const lastMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;

			const unreadCount = chatMessages.filter((msg) => !msg.isRead && msg.senderId !== 'current').length;

			return {
				...chat,
				lastMessage: lastMessage?.content || 'No messages yet',
				timestamp: lastMessage ? this.formatTimestamp(lastMessage.timestamp) : '',
				unreadCount,
			};
		});
	}

	private formatTimestamp(timestamp: Date): string {
		const now = new Date();
		const diff = now.getTime() - timestamp.getTime();

		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 60) {
			return `${minutes}m ago`;
		} else if (hours < 24) {
			return `${hours}h ago`;
		} else if (days === 1) {
			return 'Yesterday';
		} else {
			return `${days} days ago`;
		}
	}

	getChats(): Observable<Chat[]> {
		return this.chatsSubject.asObservable();
	}

	getMessages(chatId: string): Message[] {
		const allMessages = this.messagesSubject.value;
		return allMessages[chatId] || [];
	}

	addMessage(chatId: string, message: Message): void {
		const currentMessages = this.messagesSubject.value;
		const chatMessages = currentMessages[chatId] || [];

		currentMessages[chatId] = [...chatMessages, message];
		this.messagesSubject.next(currentMessages);

		// Update the chat list with the new last message
		this.updateChatList();
	}

	markMessagesAsRead(chatId: string, currentUserId: string): void {
		const currentMessages = this.messagesSubject.value;
		const chatMessages = currentMessages[chatId] || [];

		chatMessages.forEach((message) => {
			if (message.senderId !== currentUserId) {
				message.isRead = true;
			}
		});

		this.messagesSubject.next(currentMessages);
		this.updateChatList();
	}

	private updateChatList(): void {
		const messages = this.messagesSubject.value;
		const updatedChats = this.generateChatsFromMessages(messages);
		this.chatsSubject.next(updatedChats);
	}

	getChatUser(chatId: string): ChatUser | null {
		const chats = this.chatsSubject.value;
		const chat = chats.find((c) => c.id.toString() === chatId);

		if (!chat) return null;

		return {
			id: chatId,
			name: chat.name,
			avatar: chat.avatar,
			isOnline: Math.random() > 0.5, // Random online status for demo
			isTyping: chat.isTyping || false,
		};
	}
}
