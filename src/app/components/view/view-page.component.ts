
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Card } from '../../models/card.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})

export class ViewPageComponent implements OnInit, OnDestroy {
  card: Card | null = null;
  showFullscreenBtn = true;
  countdown: string | null = null;
  private timerSub: Subscription | null = null;
  revealReady = false;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const code = params['code'];
      this.firebaseService.getCardByCode(code).then(card => {
        this.card = card;
        if (card?.revealTime) {
          const revealDate = new Date(card.revealTime);
          if (revealDate > new Date()) {
            this.startCountdown(revealDate);
            this.revealReady = false;
          } else {
            this.countdown = null;
            this.revealReady = true;
          }
        } else {
          this.revealReady = true;
        }
      });
    });
  }

  startCountdown(revealDate: Date) {
    this.updateCountdown(revealDate);
    this.timerSub = interval(1000).subscribe(() => {
      this.updateCountdown(revealDate);
    });
  }

  updateCountdown(revealDate: Date) {
    const now = new Date();
    const diff = revealDate.getTime() - now.getTime();
    if (diff <= 0) {
      this.countdown = null;
      this.revealReady = true;
      if (this.timerSub) {
        this.timerSub.unsubscribe();
        this.timerSub = null;
      }
      return;
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    this.countdown = `${hours}h ${minutes}m ${seconds}s`;
  }

  goFullscreen() {
    this.showFullscreenBtn = false;
    document.documentElement.requestFullscreen();
  }

  getAnimationClass(): string {
    if (!this.card) return '';
    switch (this.card.animationType) {
      case 'fade-in': return 'fade-in';
      case 'slide': return 'slide';
      case 'typewriter': return 'typewriter';
      default: return '';
    }
  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }
}
