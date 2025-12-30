import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-animatic-loader',
    imports: [CommonModule, RouterModule],
    templateUrl: './animatic-loader.component.html',
    styleUrls: ['./animatic-loader.component.scss'],
    standalone: true,
})
export class AnimaticLoaderComponent {
  // Component logic and data go here
  name = 'Angular User';
  titleLetters = "ANIMATIC".split('');

  ngOnInit() {
    // Initialization logic if needed
    console.log('AnimaticLoaderComponent initialized');
  }
}
