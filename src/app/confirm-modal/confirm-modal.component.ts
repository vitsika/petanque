import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string,
    content: string,
  }, private dialogRef: MatDialogRef<ConfirmModalComponent>,) { }
 

  close(reason: string): void {
    this.dialogRef.close(reason);
  }

}
