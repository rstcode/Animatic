
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Card } from '../../models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  cards$: Observable<Card[]> = new Observable<Card[]>();
  userId: string = '';

  constructor(
    private firebase: FirebaseService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user && user.uid) {
      this.userId = user.uid;
      this.cards$ = from(this.firebase.getUserCards(this.userId));
    }
  }

  editCard(card: Card) {
    // TODO: Navigate to edit page or open edit dialog
  }

  deleteCard(card: Card) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.firebase.deleteCard(card.code);
      }
    });
  }
}


import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Delete Card?</h2>
    <mat-dialog-content>Are you sure you want to delete this card?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close="false">Cancel</button>
      <button mat-button color="warn" mat-dialog-close="true">Delete</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDeleteDialog {}
