import { Injectable } from '@angular/core';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Observable } from 'rxjs';

import { firebaseAuth } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private provider = new GoogleAuthProvider();
  public user$: Observable<FirebaseUser | null> = this.authState();

  async signInWithGoogle(): Promise<FirebaseUser | null> {
    if (!firebaseAuth) return Promise.reject(new Error('Auth not initialized'));
    const result = await signInWithPopup(firebaseAuth, this.provider);
    return result.user;
  }

  googleSignIn(): Promise<FirebaseUser | null> {
    return this.signInWithGoogle();
  }

  signOut(): Promise<void> {
    if (!firebaseAuth) return Promise.reject(new Error('Auth not initialized'));
    return signOut(firebaseAuth);
  }

  authState(): Observable<FirebaseUser | null> {
    return new Observable((subscriber) => {
      if (!firebaseAuth) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => subscriber.next(user), (err) => subscriber.error(err));
      return () => unsubscribe();
    });
  }

  getCurrentUser(): FirebaseUser | null {
    if (!firebaseAuth) return null;
    return firebaseAuth.currentUser ?? null;
  }
}
