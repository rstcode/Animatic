import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  loggedInUser: any = null;
  private destroy$ = new Subject<void>();

  constructor(private auth: AuthService, private router: Router, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.auth.authState().pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.loggedInUser = u;
      if (u) {        
        // navigate to dashboard automatically when already signed in
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  signIn() {
    this.loading = true;
    this.auth
      .signInWithGoogle()
      .then((user) => {
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
      .finally(() => (this.loading = false));
  }

  logout() {
    this.auth
      .signOut()
      .then(() => {
        this.loggedInUser = null;
        this.router.navigate(['/login']);
      })
      .catch((err) => console.error('Sign-out error:', err));
  }
}
