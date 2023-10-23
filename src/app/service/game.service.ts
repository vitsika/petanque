import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { TeamService } from './team.service';
import { Game, GameRecap, TournamentResult } from '../model/tournamentResult';
import { BehaviorSubject, Observable } from 'rxjs';
import { TournamentService } from './tournament.service';
import { Team, Teams } from '../model/player.model';

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





  getStep(): Observable<string> {
    return this.stepSubject.asObservable()
  }
  setStep(step: string): void {
    this.stepSubject.next(step)
  }


  initFirstGame = () => {
    var gameResults: TournamentResult = {
    }
    var teams = this.localStorageService.getTeams()
    var teamsId = this.teamService.extractTeamArray(teams.allTeams)
    var exemptedTeam!: Team
    if (teamsId.length % 2 != 0) {
      teamsId.push(-99)
    }
    var shuffledTeamsId = this.teamService.shuffleTeams(teamsId)
    gameResults.noWin = shuffledTeamsId
    gameResults.oneWin = []
    gameResults.twoWin = []
    gameResults.threeWin = []
    gameResults.fourWin = []
    gameResults.game1 = {
      games: this.teamService.buildMatch(shuffledTeamsId)
    }
    exemptedTeam = this.teamService.extractExemptedTeam(gameResults.game1.games!)
    gameResults.game1 = {
      games: gameResults.game1.games,
      exempt: exemptedTeam
    }
    this.localStorageService.saveGameResults(gameResults)
  }





  updateTournament = (game: Game, step: string) => {
    var tournamentResult: TournamentResult = this.localStorageService.getField("tournament")
    //update tournament game
    type ObjectKey = keyof typeof tournamentResult;
    // @ts-ignore
    var gameStepObject = tournamentResult[step] as GameRecap
    var games = gameStepObject.games
    var index = games!.findIndex(g => g.team1!.teamId == game.team1!.teamId && g.team2!.teamId == game.team2!.teamId);
    games![index] = game
    gameStepObject.games = games
    // @ts-ignore
    tournamentResult[step] = gameStepObject
    this.localStorageService.saveGameResults(tournamentResult)
    return tournamentResult
  }

  updateTeams = (tournamentResult: TournamentResult, step: string) => {
    var allTeams = this.localStorageService.getTeams().allTeams
    //@ts-ignore
    var gameRecap = tournamentResult[step] as GameRecap
    gameRecap.games!.forEach((game: Game) => {
      var team1 = game.team1
      var team2 = game.team2
      //update score
      allTeams = this.teamService.updateScoreTeam(team1!.teamId, allTeams, team1!.score)
      allTeams = this.teamService.updateScoreTeam(team2!.teamId, allTeams, team2!.score)
      //update Win
      var team1GoalAverage = 0;
      var team2GoalAverage = 0
      if (team1!.teamId == game.winner) {
        allTeams = this.teamService.updateWinTeam(team1!.teamId, allTeams)
        allTeams = this.teamService.updateLostTeam(team2!.teamId, allTeams)
        team1GoalAverage = team1!.score - team2!.score
        team2GoalAverage = -1*team1GoalAverage
        
      } else {
        allTeams = this.teamService.updateWinTeam(team2!.teamId, allTeams)
        allTeams = this.teamService.updateLostTeam(team1!.teamId, allTeams)
        team2GoalAverage = team2!.score - team1!.score
        team1GoalAverage = -1*team2GoalAverage
      }
      allTeams = this.teamService.updateWinGoalAverage(team1!.teamId,team2!.teamId, allTeams, team1GoalAverage, team2GoalAverage)

    })
    //increment gemaPlayed
    allTeams = this.teamService.updateGamePlayedTeam(allTeams)

    //update teams
    var newTeams: Teams = {
      allTeams: allTeams
    }
    this.localStorageService.setTeams(newTeams)
  }

  updateTournamentWinArray = (tournament:TournamentResult) => {
    var teams = this.localStorageService.getTeams()
    var oneWin:number[]=[]
    var noWin:number[]=[]
    var twoWin:number[]=[]
    var threeWin:number[]=[]
    var fourWin:number[]=[]
    teams.allTeams.forEach((team: Team) => {
      switch (team.win) {
        case 0:
          noWin.push(team.team)
          break;
        case 1:
          oneWin.push(team.team)
          break;
        case 2:
          twoWin.push(team.team)
          break;
        case 3:
          threeWin.push(team.team)
          break;
        case 4:
          fourWin.push(team.team)
          break;
        default:
          break;
      }
    });
    var noWinTeams:Team[]=[]
    var oneWinTeams:Team[]=[]
    var twoWinTeams:Team[]=[]
    var threeWinTeams:Team[]=[]
    var fourWinTeams:Team[]=[]
    noWin.forEach((id)=>{
      noWinTeams.push(this.teamService.getTeamById(id))
    })
    oneWin.forEach((id)=>{
      oneWinTeams.push(this.teamService.getTeamById(id))
    })
    twoWin.forEach((id)=>{
      twoWinTeams.push(this.teamService.getTeamById(id))
    })
    threeWin.forEach((id)=>{
      threeWinTeams.push(this.teamService.getTeamById(id))
    })
    fourWin.forEach((id)=>{
      fourWinTeams.push(this.teamService.getTeamById(id))
    })
    noWinTeams.sort((a,b) => b.goalAverage - a.goalAverage); 
    oneWinTeams.sort((a,b) => b.goalAverage - a.goalAverage); 
    twoWinTeams.sort((a,b) => b.goalAverage - a.goalAverage); 
    threeWinTeams.sort((a,b) => b.goalAverage - a.goalAverage); 
    fourWinTeams.sort((a,b) => b.goalAverage - a.goalAverage); 
    noWin=[]
    oneWin=[]
    twoWin=[]
    threeWin=[]
    fourWin=[]
    noWinTeams.forEach(a=>{ noWin.push(a.team)})
    oneWinTeams.forEach(a=>{ oneWin.push(a.team)})
    twoWinTeams.forEach(a=>{ twoWin.push(a.team)})
    threeWinTeams.forEach(a=>{ threeWin.push(a.team)})
    fourWinTeams.forEach(a=>{ fourWin.push(a.team)})
    tournament.noWin = noWin
    tournament.oneWin = oneWin
    tournament.twoWin = twoWin
    tournament.threeWin = threeWin
    tournament.fourWin = fourWin
    var rankedTeams = fourWinTeams.concat(threeWinTeams.concat(twoWinTeams.concat(oneWinTeams.concat(noWinTeams))))
    return {
      tournament:tournament,
      rankedTeams:rankedTeams
     }
  }

  nextGame = (step:string) => {
    var tournament:TournamentResult =this.localStorageService.getField("tournament")
    var teamsId = tournament.fourWin!.concat(tournament.threeWin!.concat(tournament.twoWin!.concat(tournament.oneWin!.concat(tournament.noWin!))))
    var exemptedTeam!: Team
    if (teamsId.length % 2 != 0) {
      teamsId.push(-99)
    }

   //@ts-ignore
   tournament[step] = {
      games:[],
    }
    //@ts-ignore
    tournament[step].games = this.teamService.buildMatch(teamsId)
    //@ts-ignore
    var gs:Game[] = tournament[step].games
    exemptedTeam = this.teamService.extractExemptedTeam(gs)
    //@ts-ignore
    tournament[step]  = {
       //@ts-ignore
      games:gs,
      exempt: exemptedTeam
    }
    this.localStorageService.saveGameResults(tournament)
  }
}
