import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game, GameRecap, TournamentResult } from '../model/tournamentResult';
import { LocalStorageService } from '../service/localStorage.service';
import { GameService } from '../service/game.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';
import { TournamentService } from '../service/tournament.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {
  @Input() game!: Game
  @Input() selectedStep!: string
  buttonLabel="VALIDER"
  cssClass="card-play"
  private tournamentServiceSub$!:Subscription
  constructor(private localStorageService:LocalStorageService, private gameService:GameService, private notificationService:NotificationService, private tournamentService: TournamentService) {
   
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
    if ((this.game.team1!.score==this.game.team2!.score) )    {
      this.notificationService.openNotification({
        message: 'Les équipes ne peuvent pas être à égalité',
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

}
