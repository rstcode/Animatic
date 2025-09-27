export interface Card {
  title: string;
  description: string;
  animationType: 'fade-in' | 'slide' | 'typewriter';
  font: 'Roboto' | 'Open Sans' | 'Bradley Hand';
  revealTime?: Date;
  code: string;
  createdBy: string;
  createdAt: Date;
}
