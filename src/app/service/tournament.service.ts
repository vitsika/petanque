import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TournamentResult } from '../model/tournamentResult';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private tournamentSubject: BehaviorSubject<TournamentResult> = new BehaviorSubject<TournamentResult>({
    
  } );

  constructor() { }

    getTournamentResult(): Observable<TournamentResult>{
      return this.tournamentSubject.asObservable()
    }
    setTournamentResult(tournamentResult:TournamentResult) : void {
      this.tournamentSubject.next(tournamentResult)
    }

}
