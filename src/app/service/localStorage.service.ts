import { Injectable, Injector, OnDestroy } from '@angular/core';
import {  Team, Teams } from '../model/player.model';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    private playerService!:PlayerService
 
  constructor(private injector: Injector) {
    this.playerService = injector.get<PlayerService>(PlayerService)
   }
   
  addTeam(team:Team): Teams {
    var teams = JSON.parse(localStorage.getItem('teams')!);
    if (teams.allTeams.length>0){
        teams.allTeams.push(team)
        localStorage.setItem("teams", teams)
        this.playerService.setTeams(teams)
    }
    return teams

  }

  getTeams(): Teams {
    var teams =  JSON.parse(localStorage.getItem('teams')!);
    return teams
  }

  setTeams(teams:Teams): Teams {
    localStorage.setItem("teams", JSON.stringify(teams))
    this.playerService.setTeams(teams)
    return teams
  }

}