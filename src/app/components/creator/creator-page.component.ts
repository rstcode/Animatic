import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { generateRandomCode } from '../../utils/code-generator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creator-page',
  templateUrl: './creator-page.component.html',
  styleUrls: ['./creator-page.component.scss']
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
