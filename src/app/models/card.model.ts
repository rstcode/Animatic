export interface Card {
  title: string;
  description?: string;
  animationType?: string;
  font?: string;
  backgroundColor?: string;
  revealTime?: Date | null;
  code: string;
  createdBy: string;
  createdAt: Date;
}
