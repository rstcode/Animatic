import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Card } from '../models/card.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private collectionName = 'cards';

  constructor(private afs: AngularFirestore) {}

  /**
   * Create a new card document
   */
  async createCard(card: Card): Promise<void> {
    return this.afs.collection<Card>(this.collectionName).doc(card.code).set(card);
  }

  /**
   * Get a card by its code
   */
  getCardByCode(code: string): Observable<Card | null> {
    return this.afs.collection<Card>(this.collectionName)
      .doc(code)
      .valueChanges()
      .pipe(map(data => data ? { ...data } as Card : null));
  }

  /**
   * Get all cards created by a specific user
   */
  getUserCards(userId: string): Observable<Card[]> {
    return this.afs.collection<Card>(this.collectionName, ref =>
      ref.where('createdBy', '==', userId).orderBy('createdAt', 'desc')
    )
    .valueChanges();
  }

  /**
   * Update an existing card
   */
  async updateCard(card: Card): Promise<void> {
    return this.afs.collection<Card>(this.collectionName).doc(card.code).update(card);
  }

  /**
   * Delete a card by code
   */
  async deleteCard(code: string): Promise<void> {
    return this.afs.collection<Card>(this.collectionName).doc(code).delete();
  }
}
