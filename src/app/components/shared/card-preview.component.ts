import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() animationType: string = 'fade-in';
  @Input() font: string = 'Roboto';
}
