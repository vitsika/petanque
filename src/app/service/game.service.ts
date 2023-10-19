import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { TeamService } from './team.service';
import { Game, GameRecap, TournamentResult } from '../model/tournamentResult';
import { BehaviorSubject, Observable } from 'rxjs';
import { TournamentService } from './tournament.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {


  private stepSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );

  constructor(private localStorageService: LocalStorageService,
    private teamService: TeamService, private tournamentService: TournamentService
    ) { }





    getStep(): Observable<string>{
      return this.stepSubject.asObservable()
    }
    setStep(step:string) : void {
      this.stepSubject.next(step)
    }


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
        },
        gameOver:true, 
        locked:true,
        winner:exemptTeamId  
      }
      gameResults.game1!.games?.push(exemptedGame)
    }

    this.localStorageService.saveGameResults(gameResults)
  }


  updateData = (game:Game, step:string) => {
    var tournamentResult:TournamentResult = this.localStorageService.getField("tournament")
    var teams = this.localStorageService.getField("teams")
    //update tournament game
    var winnerId = game.team1!.score>game.team2!.score?game.team1!.teamId:game.team2!.score
    type ObjectKey = keyof typeof tournamentResult;
    // @ts-ignore
    var gameStepObject = tournamentResult[step] as GameRecap
    var games = gameStepObject.games
    console.log(games, game)
    var index = games!.findIndex(g => g.team1!.teamId==game.team1!.teamId&&g.team2!.teamId==game.team2!.teamId);
    games![index]=game
    gameStepObject.games = games
    // @ts-ignore
    tournamentResult[step] = gameStepObject
    this.localStorageService.saveGameResults(tournamentResult)
    //console.log(tournamentResult)
  }
 



}
