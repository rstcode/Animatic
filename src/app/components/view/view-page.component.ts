
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Card } from '../../models/card.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-page',
  imports: [CommonModule],
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})

export class ViewPageComponent implements OnInit, OnDestroy {
  card: Card | null = null;
  showFullscreenBtn = true;
  countdown: string | null = null;
  private timerSub: Subscription | null = null;
  revealReady = false;
  loading = true;
  code: string | null = null;
  showFlash = false;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {}

 ngOnInit() {
  this.route.params.subscribe(params => {
    const code = params['code'];
    this.code = code;

    this.firebaseService.getCardMeta(code).subscribe(meta => {
      if (!meta) return;
      const revealDate = meta.revealTime ? new Date(meta.revealTime) : null;

      if (revealDate && revealDate > new Date()) {
        this.revealReady = false;
        this.startCountdown(revealDate);
      } else {
        this.revealReady = true;
        this.loading = false; // ⬅️ loader hides immediately if already revealed
        this.loadCard(code);
      }
    });
  });
}

  // Step 2️⃣ Fetch card only when revealed
  loadCard(code: string) {
    this.firebaseService.getCardByCode(code).subscribe(card => {
      this.card = card;
      // Flash animation 
      this.showFlash = true;
      console.log("Card Loaded:", card);
    });
  }


  startCountdown(revealDate: Date) {
    this.updateCountdown(revealDate);
    this.loading = false;// ⬅️ loader always hides once countdown starts
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
    this.showFullscreenBtn = true;
     // Flash animation 
    this.showFlash = true;
    setTimeout(() => {
      document.querySelector('.reveal-title')?.classList.add('light-burst');
    }, 100);
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
      this.loadCard(this.code!);
    }
    return;
   }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const hh = hours > 0 ? String(hours).padStart(2, '0') : null;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    // Format display based on hours presence
    this.countdown = hh ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  }


  goFullscreen() {
    this.showFullscreenBtn = false;
    document.documentElement.requestFullscreen();
    this.showFlash = false;
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
