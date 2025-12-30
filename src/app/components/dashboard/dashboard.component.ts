import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Card } from '../../models/card.model';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { UserProfile } from '../../models/user.model';
import { AnimaticLoaderComponent } from '../animatic-loader/animatic-loader.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimaticLoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  cards: Card[] = [];
  loggedInUser: UserProfile = null;  
  isLoading = true;

  private destroy$ = new Subject<void>();
  
  constructor(private firebaseService: FirebaseService,private auth: AuthService, private router: Router) {}

 ngOnInit() {

    this.auth.user$.pipe(
      takeUntil(this.destroy$),
      switchMap(user => {

        if (!user) {
          this.isLoading = false;
          this.cards = [];
          return of([]); // No user, no cards
        }

        this.loggedInUser = {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          profilePic: user.photoURL || null
        };

        return this.firebaseService.getUserCards(user.uid);
      })
    )
    .subscribe({
      next: (cards: Card[]) => {
        this.cards = cards;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch cards:", err);
        this.isLoading = false;
      }
    });
  }

  editCard(code: string) {
    console.log('Editing card:', code);
    // Navigate to your Edit page (if exists)
     this.router.navigate(['/creator', code]);
  }

  async deleteCard(code: string) {
    if (!confirm("Are you sure you want to delete this card?")) return;
    try {
      await this.firebaseService.deleteCard(code);
      this.firebaseService.refreshUserCards(this.loggedInUser.uid);
      console.log(`Deleted card: ${code}`);
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  }

  isLocked(card: Card): boolean {
    if (!card.revealTime) return false;
    const now = new Date();
    return new Date(card.revealTime) > now;
  }

  viewCard(code: string) {
    this.router.navigate(['/view', code]);
  }

  copyShareLink(code: string) {
    const url = `${location.origin}/Animatic/view/${code}`;
    navigator.clipboard.writeText(url);
    alert('Link copied! 📋');
  }

}
