
import { Routes } from '@angular/router';
import { CreatorPageComponent } from './components/creator/creator-page.component';
import { ViewPageComponent } from './components/view/view-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard, GuestGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent , canActivate: [GuestGuard] },
	{ path: 'creator', component: CreatorPageComponent, canActivate: [AuthGuard] },	
	{ path: 'creator/:code', component: CreatorPageComponent, canActivate: [AuthGuard] },
	{ path: 'view/:code', component: ViewPageComponent },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: 'dashboard' },
];
