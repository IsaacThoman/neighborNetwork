import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteMeta } from '@analogjs/router';
import { AuthGuard } from '../services/auth.guard.ts';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component.ts';

export const routeMeta: RouteMeta = {
	canActivate: [() => inject(AuthGuard).canActivateAdmin()],
};

@Component({
	selector: 'app-admin-page',
	standalone: true,
	imports: [CommonModule, AdminDashboardComponent],
	template: `
    <admin-dashboard></admin-dashboard>
  `,
})
export default class AdminPageComponent {}
