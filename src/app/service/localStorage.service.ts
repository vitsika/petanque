import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Team, Teams } from '../model/player.model';
import { PlayerService } from './player.service';
import { TournamentResult } from '../model/tournamentResult';
import { TournamentService } from './tournament.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private playerService!: PlayerService
  private tournamentService!: TournamentService

  constructor(private injector: Injector) {
    this.playerService = injector.get<PlayerService>(PlayerService)
    this.tournamentService = injector.get<TournamentService>(TournamentService)
  }

  addTeam(team: Team): Teams {
    var teams = JSON.parse(localStorage.getItem('teams')!);
    if (!teams) {
      teams = {}
      teams.allTeams = []
    }
    teams.allTeams.push(team)
    localStorage.setItem("teams", JSON.stringify(teams))
    this.playerService.setTeams(teams)
    return teams

  }

  getTeams(): Teams {
    var teams = JSON.parse(localStorage.getItem('teams')!);
    return teams
  }

  setTeams(teams: Teams): Teams {
    localStorage.setItem("teams", JSON.stringify(teams))
    this.playerService.setTeams(teams)
    return teams
  }

  removeAll(): void {
    localStorage.clear()
    this.playerService.setTeams({allTeams:[]})
  }

  getField(name:string): any {
    return JSON.parse(localStorage.getItem(name)!)
  }

  setField(name: string,value: any): void {
    localStorage.setItem(name, JSON.stringify(value))
  }

  saveGameResults(gameResults:TournamentResult): void {
    localStorage.setItem("tournament", JSON.stringify(gameResults))
    this.tournamentService.setTournamentResult(gameResults)
  }

}
