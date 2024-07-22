import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private summarySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() { }

  isRezise(): Observable<boolean> {
    return this.summarySubject.asObservable()
  }
  setResize(enable: boolean): void {
    this.summarySubject.next(enable)
  }

}
