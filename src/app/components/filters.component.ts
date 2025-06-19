import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterCriteria {
	department: string;
	yearsRange: string;
	location: string;
	workStyle: string;
}

@Component({
	selector: 'app-filters',
	standalone: true,
	templateUrl: './filters.component.html',
	imports: [CommonModule, FormsModule],
})
export class FiltersComponent {
	@Input()
	showFilters = false;
	@Input()
	filters: FilterCriteria = {
		department: '',
		yearsRange: '',
		location: '',
		workStyle: '',
	};
	@Input()
	profileCount = 0;

	@Output()
	filtersChange = new EventEmitter<FilterCriteria>();
	@Output()
	clearFilters = new EventEmitter<void>();

	onFiltersChange() {
		this.filtersChange.emit(this.filters);
	}

	onClearFilters() {
		this.clearFilters.emit();
	}
}
