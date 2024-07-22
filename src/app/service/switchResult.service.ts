import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwitchResultEnablerService {

  private teamsSubject: BehaviorSubject<string> = new BehaviorSubject<string>(""
  );

  constructor() { }

    isSwitchEnabled(): Observable<string>{
      return this.teamsSubject.asObservable()
    }
    enableSwitch(step:string) : void {
      this.teamsSubject.next(step)
    }

}
