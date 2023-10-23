import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TournamentInfo } from '../model/tournamentInfo';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private infoSubject: BehaviorSubject<TournamentInfo> = new BehaviorSubject<TournamentInfo>(
    {
      name: "",
      date: "",
      type: ""
    }
  );

  constructor() { }

  getInfo(): Observable<TournamentInfo> {
    return this.infoSubject.asObservable()
  }
  setInfo(info: TournamentInfo): void {
    this.infoSubject.next(info)
  }

}
