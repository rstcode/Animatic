import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { generateRandomCode } from '../../utils/code-generator';
import { Card } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-creator-page',
  templateUrl: './creator-page.component.html',
  styleUrls: ['./creator-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreatorPageComponent implements OnInit {

  cardForm!: FormGroup;
  previewCard: Partial<Card> = {};
  editMode = false;
  cardCode: string | null = null;
  showShareModal = false;
  shareUrl = '';
  todayString = new Date().toISOString().slice(0, 16);

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      template: ['cinematic', Validators.required], // PREMIUM DEFAULT
      theme: ['clean', Validators.required],       // PREMIUM DEFAULT
      revealTime: ['']
    });

    this.route.paramMap.subscribe(params => {
      this.cardCode = params.get('code');
      this.editMode = !!this.cardCode;

      if (this.editMode && this.cardCode) {
        this.firebaseService.getCardByCode(
          this.cardCode,
          this.authService.getCurrentUser()?.uid
        ).subscribe(card => {
          if (!card) return;
          
          this.cardForm.patchValue({
            title: card.title,
            description: card.description,
            template: card.template,
            theme: card.theme,
            revealTime: card.revealTime ? this.formatDate(card.revealTime) : ''
          });

          this.previewCard = card;
        });
      }
    });

    this.cardForm.valueChanges.subscribe(val => this.previewCard = val);
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  async onSubmit() {
    if (this.cardForm.invalid) return;

    const user = this.authService.getCurrentUser();
    const formValue = this.cardForm.value;

    const card: Card = {
      code: this.editMode ? this.cardCode! : generateRandomCode(),
      title: formValue.title,
      description: formValue.description,
      template: formValue.template,
      theme: formValue.theme,
      revealTime: formValue.revealTime ? new Date(formValue.revealTime) : undefined,
      createdBy: user?.uid || 'anonymous',
      createdAt: new Date()
    };

    if (this.editMode) {
      await this.firebaseService.updateCard(card);
      this.firebaseService.refreshUserCards(user?.uid || '');
      this.router.navigate(['/dashboard']);
    } else {
      await this.firebaseService.createCard(card);
      this.firebaseService.refreshUserCards(user?.uid || '');

      this.shareUrl = `${location.origin}/Animatic/view/${card.code}`;
      this.showShareModal = true;
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareUrl);
    alert('Link copied!');
  }

  openInNewTab() {
    window.open(this.shareUrl, '_blank');
  }

  closeShareModal() {
    this.showShareModal = false;
    this.router.navigate(['/dashboard']);
  }
}