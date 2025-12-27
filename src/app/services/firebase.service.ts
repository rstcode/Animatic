import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { CardMeta } from '../models/card-meta.model';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from '../models/user.model';

import { getDatabase, ref, set, get, onValue, query, orderByChild, equalTo, update, remove } from 'firebase/database';
import { firebaseApp } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private collectionName = 'cards';
  private db = getDatabase(firebaseApp);

  /**
   * Create or update a user profile after login
   */
  async saveUserProfile(uid: string, profile: { displayName?: string; email?: string; profilePic?: string | null; lastLogin?: number }): Promise<void> {
    const userRef = ref(this.db, `users/${uid}`);
    const snap = await get(userRef);
    const existing = snap.exists() ? (snap.val() as UserProfile) : undefined;
    const payload: Partial<UserProfile> = {
      displayName: profile.displayName ?? existing?.displayName ?? '',
      email: profile.email ?? existing?.email ?? '',
      profilePic: profile.profilePic ?? existing?.profilePic ?? null,
      lastLogin: profile.lastLogin ?? Math.floor(Date.now() / 1000),
      createdAt: existing?.createdAt ?? Date.now()
    };
    return update(userRef, payload as any);
  }

  private removeUndefined(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
  }
  /**
   * Create a new card document
   */
  async createCard(card: Card): Promise<void> {
  const dbCard = {
    title: card.title,
    description: card.description ?? '',
    animationType: card.animationType,
    font: card.font,
    backgroundColor: card.backgroundColor ?? '#ffffffff',
    createdAt: card.createdAt ? (card.createdAt as any).getTime() : Date.now(),
    createdBy: card.createdBy
  };

  const meta = {
    revealTime: card.revealTime ? (card.revealTime as any).getTime() : null,
    createdBy: card.createdBy
  };

  const cleanCard = this.removeUndefined(dbCard);
  const cleanMeta = this.removeUndefined(meta);

  const cardRef = ref(this.db, `${this.collectionName}/${card.code}`);
  const metaRef = ref(this.db, `cardsMeta/${card.code}`);

  await set(cardRef, cleanCard);
  return set(metaRef, cleanMeta);
}


  /**
   * Get card meta (used by public view)
   */
  getCardMeta(code: string): Observable<CardMeta | null> {
    return new Observable<CardMeta | null>(subscriber => {
      const r = ref(this.db, `cardsMeta/${code}`);
      const off = onValue(r, snap => {
        subscriber.next(snap.exists() ? (snap.val() as CardMeta) : null);
      }, err => subscriber.error(err));
      return () => off();
    });
  }

  /**
   * Get a card by its code. Only returns the card if it's revealed or the
   * requesting `viewerUid` is the owner.
   */
  getCardByCode(code: string, viewerUid?: string): Observable<Card | null> {
    const card$ = new Observable<any>(subscriber => {
      const r = ref(this.db, `${this.collectionName}/${code}`);
      const off = onValue(r, snap => subscriber.next(snap.exists() ? snap.val() : null), err => subscriber.error(err));
      return () => off();
    });

    const meta$ = new Observable<any>(subscriber => {
      const r = ref(this.db, `cardsMeta/${code}`);
      const off = onValue(r, snap => subscriber.next(snap.exists() ? snap.val() : null), err => subscriber.error(err));
      return () => off();
    });

    return combineLatest([card$, meta$]).pipe(
      map(([cardData, meta]) => {
        if (!cardData) return null;
        const createdBy = (meta && meta.createdBy) || (cardData as any).createdBy || null;
        const revealTime = meta && typeof meta.revealTime !== 'undefined' ? meta.revealTime : null;
        const isRevealed = (revealTime !== null && Date.now() >= revealTime)|| revealTime === null;
        const isOwner = !!viewerUid && viewerUid === createdBy;
        if (!isRevealed && !isOwner) return null;
        const card: Card = {
          title: cardData.title,
          description: cardData.description,
          animationType: cardData.animationType,
          font: cardData.font,
          revealTime: revealTime ? new Date(revealTime) : undefined,
          code,
          createdBy: (cardData as any).createdBy,
          createdAt: cardData.createdAt ? new Date(cardData.createdAt) : new Date(0)
        } as Card;
        return card;
      })
    );
  }

  /**
   * Get all cards created by a specific user
   */
  getUserCards(userId: string): Observable<Card[]> {
    const q = query(ref(this.db, this.collectionName), orderByChild('createdBy'), equalTo(userId));
    return new Observable<Card[]>(subscriber => {
      const off = onValue(q, snap => {
        const val = snap.exists() ? snap.val() : {};
        const list: Card[] = Object.keys(val || {}).map(key => {
          const item: any = val[key];
          return {
            title: item.title,
            description: item.description,
            animationType: item.animationType,
            font: item.font,
            revealTime: undefined,
            code: key,
            createdBy: item.createdBy,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(0)
          } as Card;
        });
        subscriber.next(list.slice().sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()));
      }, err => subscriber.error(err));
      return () => off();
    });
  }

  /**
   * Update an existing card
   */
  async updateCard(card: Card): Promise<void> {
    const dbCard = {
      title: card.title,
      description: card.description ?? '',
      animationType: card.animationType,
      font: card.font,
      backgroundColor: card.backgroundColor ?? '#ffffffff',
      createdAt: card.createdAt ? (card.createdAt as any).getTime() : Date.now(),
      createdBy: card.createdBy
    };

    const metaUpdate: any = {
      createdBy: card.createdBy
    };

    if (card.revealTime !== undefined) {
      metaUpdate.revealTime = card.revealTime ? (card.revealTime as any).getTime() : null;
    }

    const cleanCard = this.removeUndefined(dbCard);
    const cleanMeta = this.removeUndefined(metaUpdate);

    const cardRef = ref(this.db, `${this.collectionName}/${card.code}`);
    const metaRef = ref(this.db, `cardsMeta/${card.code}`);

    await update(cardRef, cleanCard);
    return update(metaRef, cleanMeta);
  }


  /**
   * Delete a card by code
   */
  async deleteCard(code: string): Promise<void> {
    const cardRef = ref(this.db, `${this.collectionName}/${code}`);
    const metaRef = ref(this.db, `cardsMeta/${code}`);
    await remove(cardRef);
    return remove(metaRef);
  }
}
