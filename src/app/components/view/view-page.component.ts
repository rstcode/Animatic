import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Card } from '../../models/card.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit, AfterViewInit, OnDestroy {

  card: Card | null = null;
  revealReady = false;
  loading = true;
  showFlash = false;
  showFullscreenBtn = true;
  countdown: string | null = null;
  private timerSub?: Subscription;
  private code: string | null = null;
  private lastTap = 0;
  private startY = 0;
  countdownSize: 'normal' | 'big' | 'huge' = 'normal';

  constructor(private route: ActivatedRoute, private db: FirebaseService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.code = params['code'];
      this.loadMeta();
    });
  }

  private loadMeta() {
    if (!this.code) return;

    this.db.getCardMeta(this.code).subscribe(meta => {
      if (!meta) return;

      const revealDate = meta.revealTime ? new Date(meta.revealTime) : null;

      if (!revealDate || revealDate <= new Date()) {
        this.revealReady = true;
        this.loading = false;
        this.loadCard();
      } else {
        this.revealReady = false;
        this.startCountdown(revealDate);
      }
    });
  }

  private loadCard() {
    if (!this.code) return;

    this.db.getCardByCode(this.code).subscribe(card => {
      this.card = card;
      this.showFlash = true;
      this.initGestures();
    });
  }

  private startCountdown(revealDate: Date) {
    this.loading = false;
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
      this.showFullscreenBtn = true;
      this.loadCard();
      this.timerSub?.unsubscribe();
      return;
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (hours > 0) {
      this.countdown = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      this.countdownSize = 'normal';
    } 
    else if (minutes > 0) {
      this.countdown = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      this.countdownSize = 'big';
    } 
    else {
    const sec = seconds.toString().padStart(2, '0');
    this.countdown = sec;
    this.countdownSize = 'huge';

    // Flash in last 3 seconds: 3, 2, 1 🔥
    if (seconds <= 3 && seconds > 0) {
      this.triggerFlash();
    }
  }
  }

  triggerFlash() {
    const el = document.querySelector('.countdown-timer');
    if (!el) return;
    el.classList.add('countdown-flash');
    setTimeout(() => el.classList.remove('countdown-flash'), 200);
  }


  goFullscreen() {
    this.showFullscreenBtn = false;
    this.showFlash = false;
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initGestures(), 400);
  }

  private initGestures() {
    const el = document.querySelector('.view-container');
    if (!el) return;

    console.log("Gestures Ready ✔️");

    // Double tap mobile
    el.addEventListener('touchend', (e: any) => {
      const now = Date.now();
      if (this.revealReady && now - this.lastTap < 300) this.goFullscreen();
      this.lastTap = now;
    });

    // Swipe Up
    el.addEventListener('touchstart', (e: any) => {
      this.startY = e.changedTouches[0].clientY;
    });
    el.addEventListener('touchend', (e: any) => {
      const endY = e.changedTouches[0].clientY;
      if (this.revealReady && this.startY - endY > 80) this.goFullscreen();
    });

    // PC Double click
    el.addEventListener('dblclick', () => {
      if (this.revealReady) this.goFullscreen();
    });
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}
