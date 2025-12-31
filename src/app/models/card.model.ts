export interface Card {
  code: string;
  title: string;
  description?: string;
  font?: string;
  revealTime?: Date;
  template: string;  // NEW
  theme: string;     // NEW
  createdBy: string;
  createdAt?: Date;
}