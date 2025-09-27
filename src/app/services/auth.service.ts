import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$: Observable<any> = this.userSubject.asObservable();

  loginWithGoogle(): void {
    // TODO: Implement Google login
  }

  logout(): void {
    // TODO: Implement logout
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }
}
