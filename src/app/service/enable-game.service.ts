import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnableGameService {

  private enableGameSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() { }

  isEnable(): Observable<boolean> {
    return this.enableGameSubject.asObservable()
  }
  setEnable(enable: boolean): void {
    this.enableGameSubject.next(enable)
  }

}
