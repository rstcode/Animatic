
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule, RouterOutlet, RouterLink } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title ='animatic-app';
  constructor(private router: Router,private route: ActivatedRoute) {}
  code = 'exampleCode123'; // Example code for the link

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
