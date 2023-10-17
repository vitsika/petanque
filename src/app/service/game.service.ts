import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { TeamService } from './team.service';
import { Game, TournamentResult } from '../model/tournamentResult';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private localStorageService: LocalStorageService,
    private teamService: TeamService
    ) { }

  initFirstGame = () => {
    var gameResults:TournamentResult={
    }
    var teams = this.localStorageService.getTeams()
    var teamsId = this.teamService.extractTeamArray(teams.allTeams)
    var shuffledTeamsId = this.teamService.shuffleTeams(teamsId)
    gameResults.noWin = shuffledTeamsId
    gameResults.game1 = {
      games:this.teamService.buildMatch(shuffledTeamsId)
    }   
    if (teamsId.length%2!=0){
      var exemptedTeam = this.teamService.selectRadomForExempt(teams.allTeams)
      gameResults.game1= {
        games:gameResults.game1.games,
        exempt:exemptedTeam
      }
      var exemptTeamId = exemptedTeam.team
      //gameResults.noWin.splice(gameResults.noWin.indexOf(exemptTeamId),1)     
      var exemptedGame:Game = {
        team1:{
          teamId:exemptTeamId,
          score:13
        },
        team2:{
          teamId:-99,
          score:0
        }  
      }
      gameResults.game1!.games?.push(exemptedGame)
    }

    this.localStorageService.saveGameResults(gameResults)
  }
 



}
