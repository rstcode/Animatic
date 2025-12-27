import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Card } from '../../models/card.model';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userCards$: Observable<Card[]> = of([]);
  loading = false;
  loggedInUser: UserProfile = null;
  private destroy$ = new Subject<void>();
  constructor(private firebaseService: FirebaseService,private auth: AuthService) {}

  ngOnInit() {
    this.userCards$ = this.auth.user$.pipe(
      switchMap(currentUser => {
        this.loggedInUser = {
          uid: currentUser?.uid || '',
          displayName: currentUser?.displayName || '',
          email: currentUser?.email || '',
          profilePic: currentUser?.photoURL || null,          
        }
        if (!currentUser) return of([]); // No login -> no cards
        return this.firebaseService.getUserCards(currentUser.uid);
      })
    );
  }

  editCard(code: string) {
    console.log('Editing card:', code);
    // Navigate to your Edit page (if exists)
    // this.router.navigate(['/edit', code]);
  }

  async deleteCard(code: string) {
    if (!confirm("Are you sure you want to delete this card?")) return;
    try {
      await this.firebaseService.deleteCard(code);
      console.log(`Deleted card: ${code}`);
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  }
}
