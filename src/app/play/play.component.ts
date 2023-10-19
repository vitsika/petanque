import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Game } from '../model/tournamentResult';
import { LocalStorageService } from '../service/localStorage.service';
import { GameService } from '../service/game.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @Input() game!: Game
  @Input() selectedStep!: string
  buttonLabel="VALIDER"
  cssClass="card-play"
  constructor(private localStorageService:LocalStorageService, private gameService:GameService, private notificationService:NotificationService) {
   
   }

  ngOnInit(): void {   
    var currentStep =  this.localStorageService.getField("gameStep")
    if (currentStep!=this.selectedStep){
      this.game.gameOver=true
    }
    this.buttonLabel = this.game.locked?"MODIFIER":"VALIDER"
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
      this.game.winner = this.game.team1!.score>this.game.team2!.score?this.game.team1!.score:this.game.team2!.score
      this.gameService.updateData(this.game,currentStep)
    }

  } 

}
