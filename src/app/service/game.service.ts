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
    this.localStorageService.setField("gameEnd", false)
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
    var lastExempteds : number[]= []
    if (tournament.game1){
      lastExempteds.push(tournament.game1.exempt!.team)
    }
    
    if (tournament.game2){
      lastExempteds.push(tournament.game2.exempt!.team)
    }
    
    if (tournament.game3){
      lastExempteds.push(tournament.game3.exempt!.team)
    }
    
    if (tournament.game4){
      lastExempteds.push(tournament.game4.exempt!.team)
    }

    var exemptedTeam!: Team
    if (teamsId.length % 2 != 0) {
      //select exemtedTeam - prevent twice selection of exempted team
      var exemptedId = teamsId[teamsId.length-1]
      var foundExempted = false
      var i =0
      while (!foundExempted && i<teamsId.length-1 ){
        if (lastExempteds.includes(exemptedId)){
          i++
          exemptedId = teamsId[teamsId.length-1-i+1]
        }else{
          foundExempted = true
        }
      }
      teamsId.splice(teamsId.indexOf(exemptedId),1)
      teamsId.push(exemptedId)
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



  /**
   * Switch win and lost team
   * @param players 
   * @param game 
   */
  switchWinLost = (players:Teams, game:Game) =>{
    var team1Lost:number ,team1Win:number,team2Lost:number,team2Win:number= 0
    if (game.winner == game.team1!.teamId){
      team1Lost = -1
      team1Win = +1      

      team2Lost = 1
      team2Win = -1    

    }else{ //team2 winner now
      team1Lost = 1
      team1Win = -1
      team2Lost = -1
      team2Win = 1
    }

    players.allTeams.filter(team => team.team==game.team1!.teamId).forEach(team => {
      team.lost = team.lost + team1Lost
      team.win = team.win + team1Win     
      
    })
    players.allTeams.filter(team => team.team==game.team2!.teamId).forEach(team => {
      team.lost = team.lost + team2Lost
      team.win = team.win + team2Win
           
    })
    this.localStorageService.setTeams(players)

  }



  switchTournamentWin = (newWinner:number, newLooser:number) => {
    var tournamentResult: TournamentResult = this.localStorageService.getField("tournament")
    //NEW WINNER
    if (tournamentResult.noWin?.includes(newWinner)){
      var newNoWin = tournamentResult.noWin.filter(item => item !== newWinner);
      tournamentResult.noWin = newNoWin
      tournamentResult.oneWin?.push(newWinner)
    }else if (tournamentResult.oneWin?.includes(newWinner)){
      var newOneWin = tournamentResult.oneWin.filter(item => item !== newWinner);
      tournamentResult.oneWin = newOneWin
      tournamentResult.twoWin?.push(newWinner)
    }else if (tournamentResult.twoWin?.includes(newWinner)){
      var newTwoWin = tournamentResult.twoWin.filter(item => item !== newWinner);
      tournamentResult.twoWin = newTwoWin
      tournamentResult.threeWin?.push(newWinner)
    }
    else if (tournamentResult.threeWin?.includes(newWinner)){
      var newThreeWin = tournamentResult.threeWin.filter(item => item !== newWinner);
      tournamentResult.threeWin = newThreeWin
      tournamentResult.fourWin?.push(newWinner)
    }

    //NEW LOOSER
     if (tournamentResult.oneWin?.includes(newLooser)){
      var newOneWin = tournamentResult.oneWin.filter(item => item !== newLooser);
      tournamentResult.oneWin = newOneWin
      tournamentResult.noWin?.push(newLooser)
    }else if (tournamentResult.twoWin?.includes(newLooser)){
      var newTwoWin = tournamentResult.twoWin.filter(item => item !== newLooser);
      tournamentResult.twoWin = newTwoWin
      tournamentResult.oneWin?.push(newLooser)
    }
    else if (tournamentResult.threeWin?.includes(newLooser)){
      var newThreeWin = tournamentResult.threeWin.filter(item => item !== newLooser);
      tournamentResult.threeWin = newThreeWin
      tournamentResult.twoWin?.push(newLooser)
    }
    else if (tournamentResult.fourWin?.includes(newLooser)){
      var newForWin = tournamentResult.fourWin.filter(item => item !== newLooser);
      tournamentResult.fourWin = newForWin
      tournamentResult.threeWin?.push(newLooser)
    }

    this.localStorageService.setField("tournament",tournamentResult)
  }

  switchScoreAndGoalAverage = (players:Teams, step:string, game:Game) =>{
    var team1NewScore:number,team2NewScore:number= 0
    if (step =="game1"){
      team1NewScore = game.team2!.score
      team2NewScore = game.team1!.score
      players.allTeams.filter(team => team.team==game.team1!.teamId).forEach(team => {
        team.score = team1NewScore
        team.goalAverage = -1*team.goalAverage
      
      })
      players.allTeams.filter(team => team.team==game.team2!.teamId).forEach(team => {
        team.score = team2NewScore
        team.goalAverage = -1*team.goalAverage
      })
    }else{
      var diffScore = Math.abs(game.team1!.score - game.team2!.score) 
      if (game.winner == game.team1!.teamId){//team1 new winner 
        players.allTeams.filter(team => team.team==game.team1!.teamId).forEach(team => {
          team.score = team.score + diffScore
          team.goalAverage = team.goalAverage + diffScore
        })
        players.allTeams.filter(team => team.team==game.team2!.teamId).forEach(team => {
          team.score = team.score - diffScore
          team.goalAverage = team.goalAverage - diffScore
        })

      }else{

        players.allTeams.filter(team => team.team==game.team1!.teamId).forEach(team => {
          team.score = team.score - diffScore
          team.goalAverage = team.goalAverage - diffScore
        })
        players.allTeams.filter(team => team.team==game.team2!.teamId).forEach(team => {
          team.score = team.score + diffScore
          team.goalAverage = team.goalAverage + diffScore
        })
        
      }
    }
    this.localStorageService.setTeams(players)

  }
}
