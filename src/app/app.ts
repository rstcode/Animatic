
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './components/home/home-page.component';
import { CreatorPageComponent } from './components/creator/creator-page.component';
import { ViewPageComponent } from './components/view/view-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CardPreviewComponent } from './components/shared/card-preview.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomePageComponent,
    CreatorPageComponent,
    ViewPageComponent,
    DashboardComponent,
    CardPreviewComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('animatic-app');
}
