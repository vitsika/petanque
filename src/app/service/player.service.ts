import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {  Team, Teams } from '../model/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private teamsSubject: BehaviorSubject<Teams> = new BehaviorSubject<Teams>(
    {allTeams:[]}
  );

  constructor() { }

    getTeams(): Observable<Teams>{
      return this.teamsSubject.asObservable()
    }
    setTeams(teams:Teams) : void {
      this.teamsSubject.next(teams)
    }

}
