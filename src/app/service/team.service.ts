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
      var game:Game = {
        team1: {
          teamId:this.getTeamById(teamsId[i]).team,
          score:0
        },
        team2:{
          teamId:this.getTeamById(teamsId[i+1]).team,
          score:0
        }
      }
      games.push(game)
    }

    return games
  }





}
