import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-action-buttons',
	standalone: true,
	templateUrl: './action-buttons.component.html',
	imports: [CommonModule],
})
export class ActionButtonsComponent {
	@Output()
	pass = new EventEmitter<void>();
	@Output()
	connect = new EventEmitter<void>();

	onPass() {
		this.pass.emit();
	}

	onConnect() {
		this.connect.emit();
	}
}
