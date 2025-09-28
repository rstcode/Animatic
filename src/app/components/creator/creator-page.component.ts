import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { generateRandomCode } from '../../utils/code-generator';
import { Card } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-creator-page',
  templateUrl: './creator-page.component.html',
  styleUrls: ['./creator-page.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  standalone: true
})
export class CreatorPageComponent implements OnInit {
  cardForm!: FormGroup;
  previewCard: Partial<Card> = {};
  fonts = ['Roboto', 'Open Sans', 'Bradley Hand', 'Cursive', 'Monospace'];
  animations = ['fade-in', 'slide', 'typewriter'];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      animationType: ['', Validators.required],
      font: ['', Validators.required],
      revealTime: ['']
    });

    // Live preview
    this.cardForm.valueChanges.subscribe(val => {
      this.previewCard = {
        title: val.title,
        description: val.description,
        animationType: val.animationType,
        font: val.font,
        revealTime: val.revealTime
      };
    });
  }

  async onSubmit() {
    if (this.cardForm.invalid) return;

    const code = generateRandomCode();
    const user = await this.authService.getCurrentUser();

    const newCard: Card = {
      code,
      title: this.cardForm.value.title,
      description: this.cardForm.value.description,
      animationType: this.cardForm.value.animationType,
      font: this.cardForm.value.font,
      revealTime: this.cardForm.value.revealTime ? new Date(this.cardForm.value.revealTime) : undefined,
      createdBy: user?.uid || 'anonymous',
      createdAt: new Date()
    };

    await this.firebaseService.createCard(newCard);
    this.router.navigate(['/view', code]);
  }
}
