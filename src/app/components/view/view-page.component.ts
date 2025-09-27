import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {
  card: Card | null = null;
  loading = true;
  countdown: number = 0;
  showFullscreenBtn = true;

  constructor(private route: ActivatedRoute, private firebase: FirebaseService) {}

  async ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code')!;
    this.card = await this.firebase.getCardByCode(code);
    this.loading = false;
    if (this.card && this.firebase.isRevealTimeFuture(this.card)) {
      this.countdown = Math.floor((new Date(this.card.revealTime!).getTime() - Date.now()) / 1000);
      this.startCountdown();
    }
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  goFullscreen() {
    this.showFullscreenBtn = false;
    document.documentElement.requestFullscreen();
  }
}
