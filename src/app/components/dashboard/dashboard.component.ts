import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Card } from '../../models/card.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userCards$!: Observable<Card[]>;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.userCards$ = this.firebaseService.getUserCards(user.uid);
    }
  }

  async deleteCard(code: string) {
    const confirmed = confirm('Are you sure you want to delete this card?');
    if (confirmed) {
      await this.firebaseService.deleteCard(code);
    }
  }

  editCard(code: string) {
    // Navigate to creator page with edit mode (to be implemented later)
    alert(`Edit card with code: ${code}`);
  }
}
