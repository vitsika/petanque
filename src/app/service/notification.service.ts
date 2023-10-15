import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notification } from '../model/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  openNotification =(notification:Notification) => {
    this.snackBar.open(notification.message,notification.actionText.toLocaleUpperCase(),{
      panelClass:[notification.type],
      duration:5000
    })
  }
}
