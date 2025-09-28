import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    // Live user state observable
    this.user$ = this.afAuth.authState;
  }

  /**
   * Google Sign In
   */
  async googleSignIn(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return this.afAuth.signInWithPopup(provider);
  }

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  /**
   * Get current user once (not as observable)
   */
  getCurrentUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }
}
