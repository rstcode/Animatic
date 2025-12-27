import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private auth: AuthService, private router: Router, private firebaseService: FirebaseService) {
    this.user$ = this.auth.user$;
  }

  login() {
    this.auth.googleSignIn().then((user) => {
        console.log('Signed in user:', user);
        if (user) {
          this.firebaseService
            .saveUserProfile(user.uid, {
              displayName: (user.displayName as string) || '',
              email: (user.email as string) || '',
              profilePic: (user.photoURL as string) || null,
              lastLogin: Math.floor(Date.now() / 1000)
            })
            .catch((err) => console.warn('saveUserProfile failed', err))
            .finally(() => this.router.navigate(['/dashboard']));
        } else {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((err) => {
        console.error('Sign-in error:', err);
        alert('Sign-in failed: ' + (err?.message || err));
      })
      .finally(() => {});
  }

  logout() {
    this.auth.signOut().then(() => { this.router.navigate(['/login']); }).
    catch(err => {console.error('Sign-out error:', err); });
  }
}
