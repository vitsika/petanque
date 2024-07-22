import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string,
    content: string,
  }, private dialogRef: MatDialogRef<InfoModalComponent>,) { }

  ngOnInit(): void {
  }

  close(reason: string): void {
    this.dialogRef.close(reason);
  }

}
