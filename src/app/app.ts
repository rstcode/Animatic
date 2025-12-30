import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('FireTest');
  public user$: Observable<any>;
  isDarkMode = false;
  showHeader = true;

  constructor(private auth: AuthService, private router: Router, private firebaseService: FirebaseService) {
    this.user$ = this.auth.user$;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !event.url.startsWith('/view/');
      }
    });
  }

  ngOnInit() {   
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  logout() {
    this.auth.signOut().then(() => { this.router.navigate(['/login']); }).
    catch(err => {console.error('Sign-out error:', err); });
  }
}
