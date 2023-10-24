import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game, GameRecap, TournamentResult } from '../model/tournamentResult';
import { LocalStorageService } from '../service/localStorage.service';
import { GameService } from '../service/game.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';
import { TournamentService } from '../service/tournament.service';
import { Subscription } from 'rxjs';
import { TeamService } from '../service/team.service';
import { Team } from '../model/player.model';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {
  @Input() game!: Game
  @Input() index!: number
  @Input() selectedStep!: string
  buttonLabel="VALIDER"
  cssClass="card-play"
  team1Tooltip!:string
  team2Tooltip!:string
  private tournamentServiceSub$!:Subscription
  constructor(private localStorageService:LocalStorageService, private gameService:GameService, private notificationService:NotificationService, private tournamentService: TournamentService
    , private teamService: TeamService) {
   
   }
 

  ngOnInit(): void {   
    var currentStep =  this.localStorageService.getField("gameStep")
    if (currentStep!=this.selectedStep){
      this.game.gameOver=true
    }
    this.buttonLabel = this.game.locked?"MODIFIER":"VALIDER"
    this.tournamentServiceSub$ = this.tournamentService.getTournamentResult().subscribe((tResult:TournamentResult) => {
      var currentStep =  this.localStorageService.getField("gameStep")
       //@ts-ignore
      var gamerecap = tResult[currentStep] as GameRecap
      if (gamerecap){
        var games =gamerecap.games as Game[]
        var foundGame = games.find((g)=> {
          return (g.team1!.teamId == this.game.team1!.teamId&&g.team2!.teamId == this.game.team2!.teamId) 
        })
        if (foundGame){
          this.game = foundGame
        }
      }
      var team1 = this.teamService.getTeamById(this.game.team1!.teamId)
      var team2 = this.teamService.getTeamById(this.game.team2!.teamId)
      this.team1Tooltip = this.buildTooltip(team1)
      this.team2Tooltip = this.buildTooltip(team2)
     
     
    })

  }

  setClass(){
    var cssClass = "card-play" 
    if (this.game.gameOver){
      cssClass =  "card-play-over"
    }else if (this.game.locked){
      cssClass = "card-play-locked"
    }
    return cssClass
  }

  onCLickButton(){
    var error = ""
    if (this.game.team1!.score<0 || this.game.team1!.score>13 || this.game.team2!.score<0 || this.game.team2!.score>13){
      error = "Le score doit être compris entre 0 et 13 "
    }
    if ((this.game.team1!.score==this.game.team2!.score) ){
      error = 'Les équipes ne peuvent pas être à égalité'
    }
    if (error!=""){
      this.notificationService.openNotification({
        message: error,
        actionText: 'Fermer',
        type: NotificationType.ERROR,
      })
    }else{
      var currentStep =  this.localStorageService.getField("gameStep")
      this.game.locked=!this.game.locked
      this.buttonLabel = this.game.locked?"MODIFIER":"VALIDER"
      this.game.winner = this.game.team1!.score>this.game.team2!.score?this.game.team1!.teamId:this.game.team2!.teamId
      this.gameService.updateTournament(this.game,currentStep)
    }

  } 

  ngOnDestroy(): void {
    this.tournamentServiceSub$.unsubscribe()
  }

  buildTooltip = (team:Team) => {
    var tooltip = ""
    if (team){
      tooltip = team.player1
      if (team.player2!=""){
        tooltip = tooltip + " / " + team.player2
      }
      if (team.player3!=""){
        tooltip = tooltip + " / " + team.player3
      }
    }
    
    return tooltip
  }

}
