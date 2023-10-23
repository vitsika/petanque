import { Injectable } from '@angular/core';
import { Team, Teams } from '../model/player.model';
import { LocalStorageService } from './localStorage.service';
import { Game } from '../model/tournamentResult';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private localStorageService: LocalStorageService) { }

  getTeamById(id: number): Team {
    var allTeams = this.localStorageService.getTeams().allTeams
    return allTeams.find(t => t.team === id)!
  }

  extractTeamArray(teams: Team[]): number[] {
    var teamsIds: number[] = []
    teams.forEach(team => {
      teamsIds.push(team.team)
    })
    return teamsIds
  }

  /**
   * random for exempted game
   * @param teams 
   * @returns 
   */
  selectRadomForExempt(teams:Team[]):Team{
    return teams [Math.floor(Math.random()*teams.length)];
  }


  extractExemptedTeam(games:Game[]): any{
   var exemptedId = 0
   games.forEach((game:Game)=>{
    if (game.team1!.teamId==-99){
      exemptedId = game.team2!.teamId
    }else if (game.team2!.teamId==-99){
      exemptedId = game.team1!.teamId
    }
   })
   if (exemptedId!=0){
      return this.getTeamById(exemptedId)
   }
   return {}
  }

  shuffleTeams(teams:number[]):number[] {
    for (let i = teams.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [teams[i], teams[j]] = [teams[j], teams[i]]; 
    } 
    return teams; 
  }
  /**
   * filter team by nb of "sort"[win,lost etc..]
   * @param teams 
   * @param nb 
   * @param sort 
   * @returns 
   */
  filterTeam(teams: Team[], nb: number, sort: string): Team[] {
    var teams: Team[] = []
    teams.forEach(team => {
      switch (sort) {
        case "win": {
          if (team.win == nb) {
            teams.push(team)
          }
          break
        }
        case "score": {
          if (team.score == nb) {
            teams.push(team)
          }
          break
        }
        default: {
          if (team.win == nb) {
            teams.push(team)
          }
          break
        }
      }
    })
    return teams
  }

  buildMatch(teamsId:number[]):Game[]{
    var games: Game[] = []   
    for (let i=0;i<teamsId.length-1;i+=2){
      var team1Id = teamsId[i]==-99?-99:this.getTeamById(teamsId[i]).team
      var team2Id = teamsId[i+1]==-99?-99:this.getTeamById(teamsId[i+1]).team
      var gameOver = false
      var locked = (teamsId[i]==-99||teamsId[i+1]==-99)?true:false
      var team1Score = teamsId[i+1]==-99?13:0
      var team2Score = teamsId[i]==-99?13:0
      if ( teamsId[i]==-99 || teamsId[i+1]==-99){
        gameOver = true
      }
      var winner = -1
      if ( teamsId[i]==-99){
        winner = teamsId[i+1]
      }
      if ( teamsId[i+1]==-99){
        winner = teamsId[i]
      }

      var game:Game = {
        team1: {
          teamId:team1Id,
          score:team1Score
        },
        team2:{
          teamId:team2Id,
          score:team2Score
        },
        gameOver:gameOver,
        locked:locked,
        winner:winner
      }
      games.push(game)
    }
    return games
  }

  updateScoreTeam = (teamId:number, teams:Team[], score:number) => {
    teams.forEach((team:Team) => {
      if (team.team==teamId){
        team.score+=score
      }
    })
    return teams
  }

  updateWinTeam = (teamId:number, teams:Team[]) => {
    teams.forEach((team:Team) => {
      if (team.team==teamId){
        team.win+=1
      }
    })
    return teams
  }
  updateLostTeam = (teamId:number, teams:Team[]) => {
    teams.forEach((team:Team) => {
      if (team.team==teamId){
        team.lost+=1
      }
    })
    return teams
  }

  updateGamePlayedTeam = (teams:Team[]) => {
    teams.forEach((team:Team) => {
        team.gamePlayed+=1
    })
    return teams
  }



  updateWinGoalAverage = (team1Id:number,team2Id:number, teams:Team[], team1GA: number, team2GA:number) => {
    teams.forEach((team:Team) => {
      if (team.team==team1Id){
        team.goalAverage+= team1GA
      }
      if (team.team==team2Id){
        team.goalAverage+=team2GA
      }
    })
    return teams
  }

  updateLostGoalAverage = (teamId:number, teams:Team[], team1Score:number, team2Score:number) => {
    teams.forEach((team:Team) => {
      if (team.team==teamId){
        team.goalAverage = team2Score - team1Score
      }
    })
    return teams
  }




}
