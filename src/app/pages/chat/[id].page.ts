import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatConversationComponent } from './chat-conversation.component.ts';

export const routeMeta = {
	title: 'Chat',
};

@Component({
	selector: 'app-chat-page',
	standalone: true,
	imports: [ChatConversationComponent],
	template: `<app-chat-conversation [chatId]="chatId"></app-chat-conversation>`,
})
export default class ChatPage {
	chatId: string;

	constructor(private route: ActivatedRoute) {
		this.chatId = this.route.snapshot.params['id'];
	}
}
