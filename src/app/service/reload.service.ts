import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  private reloadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() { }

  isReload(): Observable<boolean> {
    return this.reloadSubject.asObservable()
  }
  setReload(enable: boolean): void {
    this.reloadSubject.next(enable)
  }

}
