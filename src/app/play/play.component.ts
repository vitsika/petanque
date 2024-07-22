import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game, GameRecap, TournamentResult } from '../model/tournamentResult';
import { LocalStorageService } from '../service/localStorage.service';
import { GameService } from '../service/game.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';
import { TournamentService } from '../service/tournament.service';
import { Subscription, first } from 'rxjs';
import { TeamService } from '../service/team.service';
import { Team, Teams } from '../model/player.model';
import { SwitchResultEnablerService } from '../service/switchResult.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

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
  enableSwitch:string=""
  isBot = false
  gameEnd:boolean = false
  private tournamentServiceSub$!:Subscription
  constructor(private localStorageService:LocalStorageService, private gameService:GameService, private notificationService:NotificationService, private tournamentService: TournamentService
    , private teamService: TeamService, private enableSwitchService: SwitchResultEnablerService,private dialog: MatDialog,) {
   
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
    if (this.game.team1?.teamId==-99 || this.game.team2?.teamId==-99){
      this.isBot = true
    }
    this.enableSwitchService.isSwitchEnabled().subscribe((step:string) => {
     this.enableSwitch = step
    })
    this.gameEnd = this.localStorageService.getField("gameEnd")
    

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

  switchResult = () => {
   

    let dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: 'auto',
      width: '300px',
      disableClose: true,
      data: {
        title: 'Changer le gagnant',
        content: 'Voulez-vous vraiment permuter le résultat?',
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res === 'confirm') {
        this.game.winner = this.game.winner==this.game.team1!.teamId?this.game.team2!.teamId:this.game.team1!.teamId
    var newWinner, newLooser:number = -1
    if (this.game.winner == this.game.team1!.teamId){
      newWinner = this.game.team1!.teamId
      newLooser = this.game.team2!.teamId
    }else{
      newWinner = this.game.team2!.teamId
      newLooser = this.game.team1!.teamId
    }


    
    // Update allTeams in storage
    var players = this.localStorageService.getTeams()
    this.gameService.switchWinLost(players, this.game)
    this.gameService.switchScoreAndGoalAverage(players, this.enableSwitch, this.game)

     // display change on card
    var oldT1Score = this.game.team1?.score
    var oldT2Score = this.game.team2?.score 
    this.game.team1!.score = oldT2Score!
    this.game.team2!.score = oldT1Score!

    //update tournamentResults
    this.gameService.updateTournament(this.game,this.enableSwitch)
    this.gameService.switchTournamentWin(newWinner, newLooser)
    var tournamentResult: TournamentResult = this.localStorageService.getField("tournament")
    var step = this.localStorageService.getField("gameStep")

    //update tournament game
    type ObjectKey = keyof typeof tournamentResult;
    // @ts-ignore
    var gameStepObject = tournamentResult[step] as GameRecap
    var games = gameStepObject.games
    var newGames:Game[] = []
    games?.forEach(game => {
      if (game.team1?.teamId == this.game.team1?.teamId){
        game.team1!.teamId = this.game.team2!.teamId
      }else  if (game.team2?.teamId == this.game.team1?.teamId){
        game.team2!.teamId = this.game.team2!.teamId
      }else  if (game.team1?.teamId == this.game.team2?.teamId){
        game.team1!.teamId = this.game.team1!.teamId
      }else  if (game.team2?.teamId == this.game.team2?.teamId){
        game.team2!.teamId = this.game.team1!.teamId
      }
      newGames.push(game)
    }) 
   

  

    gameStepObject.games = newGames
    // @ts-ignore
    tournamentResult[step] = gameStepObject
    this.localStorageService.saveGameResults(tournamentResult)
      }
    });




    


 
  }



  


  

  

}
