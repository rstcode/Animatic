import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
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
export class ViewPageComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  card: Card | null = null;

  revealReady = false;
  loading = true;
  showFlash = false;
  showFullscreenBtn = true;

  countdown: string | null = null;
  countdownSize: 'normal' | 'big' | 'huge' = 'normal';

  private timerSub?: Subscription;
  private code: string | null = null;

  private lastTap = 0;
  private startY = 0;

  private fxPlayed = false;
  private gesturesReady = false;

  constructor(
    private route: ActivatedRoute,
    private db: FirebaseService
  ) {}

  /* =========================
     INIT
  ========================= */

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.code = params['code'];
      this.resetState();
      this.loadMeta();
    });
  }

  private resetState() {
    this.card = null;
    this.fxPlayed = false;
    this.showFullscreenBtn = true;
    this.showFlash = false;
  }

  /* =========================
     META + CARD LOAD
  ========================= */

  private loadMeta() {
    if (!this.code) return;

    this.db.getCardMeta(this.code).subscribe(meta => {
      if (!meta) return;

      const revealDate = meta.revealTime ? new Date(meta.revealTime) : null;

      if (!revealDate || revealDate <= new Date()) {
        this.revealReady = true;
        this.loading = false;
        this.showFullscreenBtn = true;
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
    });
  }

  /* =========================
     COUNTDOWN
  ========================= */

  private startCountdown(revealDate: Date) {
    this.loading = false;
    this.updateCountdown(revealDate);

    this.timerSub = interval(1000).subscribe(() => {
      this.updateCountdown(revealDate);
    });
  }

  updateCountdown(revealDate: Date) {
    const diff = revealDate.getTime() - Date.now();

    if (diff <= 0) {
      this.countdown = null;
      this.revealReady = true;
      this.showFullscreenBtn = false;
      this.showFlash = true;
      this.loadCard();
      this.timerSub?.unsubscribe();
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (h > 0) {
      this.countdown = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
      this.countdownSize = 'normal';
    } else if (m > 0) {
      this.countdown = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
      this.countdownSize = 'big';
    } else {
      this.countdown = s.toString().padStart(2,'0');
      this.countdownSize = 'huge';
      if (s <= 3 && s > 0) this.triggerFlash();
    }
  }

  triggerFlash() {
    const el = document.querySelector('.countdown-timer');
    if (!el) return;
    el.classList.add('countdown-flash');
    setTimeout(() => el.classList.remove('countdown-flash'), 200);
  }

  /* =========================
     FULLSCREEN + GESTURES
  ========================= */

  goFullscreen() {
    this.showFullscreenBtn = false;
    this.showFlash = false;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  }

  ngAfterViewInit() {
    this.initGestures();
  }

  private initGestures() {
    if (this.gesturesReady) return;
    this.gesturesReady = true;

    const el = document.querySelector('.view-container');
    if (!el) return;

    // Double tap (mobile)
    el.addEventListener('touchend', () => {
      const now = Date.now();
      if (this.revealReady && now - this.lastTap < 300) this.goFullscreen();
      this.lastTap = now;
    });

    // Swipe up
    el.addEventListener('touchstart', (e: any) => {
      this.startY = e.changedTouches[0].clientY;
    });

    el.addEventListener('touchend', (e: any) => {
      const endY = e.changedTouches[0].clientY;
      if (this.revealReady && this.startY - endY > 80) this.goFullscreen();
    });

    // Desktop double click
    el.addEventListener('dblclick', () => {
      if (this.revealReady) this.goFullscreen();
    });
  }

  /* =========================
     TEMPLATE FX (ONE PLACE)
  ========================= */

  ngAfterViewChecked() {
    if (
      !this.fxPlayed &&
      this.revealReady &&
      !this.showFullscreenBtn &&
      this.card &&
      document.querySelector('.reveal-box')
    ) {
      this.fxPlayed = true;
      this.runTemplateFX();
    }
  }

  runTemplateFX() {
    const box = document.querySelector('.reveal-box');
    if (!box || !this.card) return;

    switch (this.card.template) {
      case 'celebrate2026':
        box.classList.add('celebrate2026');
        this.fireworks2026();
        break;

      case 'celebration':
        this.launchConfetti();
        break;

      case 'mystery':
        this.addFilmGrain();
        break;
    }
  }

  /* =========================
     FX HELPERS
  ========================= */

  fireworks2026() {
    const box = document.querySelector('.reveal-box');
    if (!box) return;

    for (let i = 0; i < 24; i++) {
      const fw = document.createElement('div');
      fw.className = 'firework';

      fw.style.setProperty('--fw-color', this.randomFireColor());
      fw.style.setProperty('--dx', (Math.random() * 500 - 250) + 'px');
      fw.style.setProperty('--dy', (Math.random() * 500 - 250) + 'px');

      box.appendChild(fw);
      setTimeout(() => fw.remove(), 1500);
    }
  }

  randomFireColor(): string {
    const colors = ['#FFD700', '#FF2A6F', '#00E7FF', '#53FF45'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  launchConfetti() {
    for (let i = 0; i < 30; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.setProperty('--random-color', this.randomColor());
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2000);
    }
  }

  randomColor(): string {
    const colors = ['#FF4D4D','#FFC107','#4CAF50','#2196F3','#FF6EC7','#FF9800','#9C27B0'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addFilmGrain() {
    const fg = document.createElement('div');
    fg.className = 'film-grain';
    document.body.appendChild(fg);
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}
