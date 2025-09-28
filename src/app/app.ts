
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
import { AuthService } from './services/auth.service';

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
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title ='animatic-app';
  user = null;
  constructor(private router: Router,private route: ActivatedRoute, private authService: AuthService) {}
  code = 'exampleCode123'; // Example code for the link

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
     // Subscribe to user state
    this.authService.user$.subscribe(u => this.user = u);
  }

  signIn() {
    this.authService.googleSignIn().catch(err => console.error(err));
  }

  signOut() {
    this.authService.signOut().catch(err => console.error(err));
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
