import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { generateRandomCode } from '../../utils/code-generator';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CreatorPageComponent {
  cardForm: FormGroup;
  preview: any = {};

  animationTypes = ['fade-in', 'slide', 'typewriter'];
  fonts = ['Roboto', 'Open Sans', 'Bradley Hand'];

  constructor(private fb: FormBuilder, private firebase: FirebaseService, private router: Router) {
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      animationType: ['', Validators.required],
      font: ['', Validators.required],
      revealTime: ['']
    });
    this.cardForm.valueChanges.subscribe(val => this.preview = val);
  }

  async submit() {
    if (this.cardForm.invalid) return;
    const code = generateRandomCode();
    await this.firebase.createCard({ ...this.cardForm.value, code, createdBy: 'userId', createdAt: new Date() });
    this.router.navigate(['/view', code]);
  }
}
