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

  formatDate(date: Date): string {
    return new Date(date).toISOString().slice(0, 16);
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
      this.router.navigate(['/view', card.code]);
    }
  }
}
