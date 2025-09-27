import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  // TODO: Inject AngularFire services

  createCard(card: Card): Promise<string> {
    // TODO: Save card to Firestore and return code
    return Promise.resolve('ABC123');
  }

  getCardByCode(code: string): Promise<Card | null> {
    // TODO: Fetch card by code
    return Promise.resolve(null);
  }

  getUserCards(userId: string): Promise<Card[]> {
    // TODO: Fetch all cards for user
    return Promise.resolve([]);
  }

  updateCard(card: Card): Promise<void> {
    // TODO: Update card
    return Promise.resolve();
  }

  deleteCard(code: string): Promise<void> {
    // TODO: Delete card
    return Promise.resolve();
  }

  isRevealTimeFuture(card: Card): boolean {
    return card.revealTime ? new Date(card.revealTime) > new Date() : false;
  }
}
