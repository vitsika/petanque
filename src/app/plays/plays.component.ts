import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '../service/localStorage.service';
import { Team } from '../model/player.model';
import { GameService } from '../service/game.service';
import { GameEnum } from '../model/game.enum';
import { Game, TournamentResult } from '../model/tournamentResult';
import { TournamentService } from '../service/tournament.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plays',
  templateUrl: './plays.component.html',
  styleUrls: ['./plays.component.scss']
})
export class PlaysComponent implements OnInit, OnDestroy {
  allTeams: Team[] = []
  gameSteps: any[] = ["Partie 1", "Partie 2", "Partie 3", "Partie 4"]
  tournament: any = {}
  gameStep: string = ""
  games = []
  defaultStep = <any>""
  selectedStep:string =""
  disableNextButton = false
  gameServiceSub$!:Subscription
  tournamentServiceSub$!:Subscription


  constructor(private localStorageService: LocalStorageService, private gameService: GameService, private tournamentService:TournamentService ) {
  


  }

  ngOnInit(): void {
    this.gameServiceSub$ =  this.gameService.getStep().subscribe((step) => {
      console.log("gameServiceSub")
      this.gameStep = step 
      if (step){
        this.games = this.tournament = this.localStorageService.getField("tournament")[step]!.games
        this.setDefaultStep(step)
        this.setNextButton(this.localStorageService.getField("tournament"))
      }
    })
    this.tournamentServiceSub$ = this.tournamentService.getTournamentResult().subscribe((tournamentResult:TournamentResult) =>{
      console.log("tournamentServiceSub")
      this.setNextButton(this.localStorageService.getField("tournament"))
    })
    if (this.localStorageService.getTeams()) {
      this.allTeams = this.localStorageService.getTeams().allTeams
      this.tournament = this.localStorageService.getField("tournament")
      this.gameStep = this.localStorageService.getField("gameStep")
      if (this.gameStep) {
        this.games = this.tournament = this.localStorageService.getField("tournament")[this.gameStep]!.games
        this.setDefaultStep(this.gameStep)
      }

    }
    this.setNextButton(this.localStorageService.getField("tournament"))


  }

  onGameChange(event: any) {
    var newStep = GameEnum[event.value]
    this.games = this.tournament = this.localStorageService.getField("tournament")[newStep]!.games || []
    this.disableGameOption(newStep)
    this.selectedStep = newStep
  }

  setDefaultStep = (step: string) => {
    const index = Object.keys(GameEnum).indexOf(step);
    this.defaultStep = Object.values(GameEnum)[index];
    this.selectedStep = step
  }

  disableGameOption = (step: string) => {
    if (this.gameStep){
      var currentStepNumber = this.gameStep.charAt(this.gameStep.length - 1)
      var optionStepNumber = step.charAt(step.length - 1)
      return (optionStepNumber > currentStepNumber) ? true : false
    }
    return false
   
  }

  setNextButton = (tournamentResult: TournamentResult) => {
    this.disableNextButton = false
    if (tournamentResult && this.gameStep!=""){
      var games = this.localStorageService.getField("tournament")[this.gameStep]!.games
      var isAllOver =  this.isAllGameOver(games)
      var isAllLocked =  this.isAllGameLocked(games)
      console.log("isAllOver", isAllOver)
      console.log("isAllLocked", isAllLocked)
      if (isAllOver){
        this.disableNextButton = true
      }else{
        if (!isAllLocked){
          this.disableNextButton = true
        }
      }
      
    } 
  }

  isAllGameOver = (games:Game[]) => {
    var gameOver = true
    games.forEach((game:Game)=>{
      if (!game.gameOver){
        gameOver = false
      }
    })
    return gameOver
  }

  isAllGameLocked = (games:Game[]) => {
    var gameLocked = true
    games.forEach((game:Game)=>{
      if (!game.locked){
        gameLocked = false
      }
    })
    return gameLocked
  }

  ngOnDestroy() {
    this.gameServiceSub$.unsubscribe();
    this.tournamentServiceSub$.unsubscribe();
  }

  goNext = () => {
    var tournament = this.localStorageService.getField("tournament")
    if (tournament){
      var games = this.localStorageService.getField("tournament")[this.gameStep]!.games
      games.forEach((game:Game)=>{
        game.gameOver = true
        this.gameService.updateData(game,this.gameStep)
      })
    }
  }





}
