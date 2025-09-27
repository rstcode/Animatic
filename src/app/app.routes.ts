
import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page.component';
import { CreatorPageComponent } from './components/creator/creator-page.component';
import { ViewPageComponent } from './components/view/view-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
	{ path: '', component: HomePageComponent },
	{ path: 'creator', component: CreatorPageComponent },
	{ path: 'view/:code', component: ViewPageComponent },
	{ path: 'dashboard', component: DashboardComponent },
];
