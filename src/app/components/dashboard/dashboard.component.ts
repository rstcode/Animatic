import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cards: Card[] = [];
  loading = true;

  constructor(private firebase: FirebaseService, private auth: AuthService) {}

  async ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.cards = await this.firebase.getUserCards(user.uid);
    }
    this.loading = false;
  }

  async deleteCard(code: string) {
    if (confirm('Are you sure you want to delete this card?')) {
      await this.firebase.deleteCard(code);
      this.cards = this.cards.filter(card => card.code !== code);
    }
  }
}
