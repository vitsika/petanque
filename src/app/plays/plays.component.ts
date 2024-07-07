import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '../service/localStorage.service';
import { Team } from '../model/player.model';
import { GameService } from '../service/game.service';
import { GameEnum } from '../model/game.enum';
import { Game, TournamentResult } from '../model/tournamentResult';
import { TournamentService } from '../service/tournament.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';
import { SwitchResultEnablerService } from '../service/switchResult.service';

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
  games:Game[] = []
  defaultStep = <any>""
  selectedStep: string = ""
  disableNextButton = false
  gameServiceSub$!: Subscription
  tournamentServiceSub$!: Subscription
  filterEmpty = true;
  filterText:string=""


  constructor(private localStorageService: LocalStorageService, private gameService: GameService, private tournamentService: TournamentService, private notificationService:NotificationService, private enableSwitchService: SwitchResultEnablerService) {



  }

  ngOnInit(): void {
    this.gameServiceSub$ = this.gameService.getStep().subscribe((step) => {
      this.gameStep = step
      if (step) {
         var tournament = this.localStorageService.getField("tournament")
        if (tournament)
        this.games = this.tournament = tournament[step]!.games
        this.setDefaultStep(step)
        this.setNextButton(this.localStorageService.getField("tournament"))
      }
    })
    this.tournamentServiceSub$ = this.tournamentService.getTournamentResult().subscribe((tournamentResult: TournamentResult) => {
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
    this.enableSwitchResultHandler()


  }

  onGameChange(event: any) {
    var newStep = GameEnum[event.value]
    this.games = this.tournament = this.localStorageService.getField("tournament")[newStep]!.games || []
    this.disableGameOption(newStep)
    this.selectedStep = newStep
    this.enableSwitchResultHandler()
  }

  setDefaultStep = (step: string) => {
    const index = Object.keys(GameEnum).indexOf(step);
    this.defaultStep = Object.values(GameEnum)[index];
    this.selectedStep = step
  }

  disableGameOption = (step: string) => {
    if (this.gameStep) {
      var currentStepNumber = this.gameStep.charAt(this.gameStep.length - 1)
      var optionStepNumber = step.charAt(step.length - 1)
      return (optionStepNumber > currentStepNumber) ? true : false
    }
    return false

  }

  setNextButton = (tournamentResult: TournamentResult) => {
    this.disableNextButton = false
    if (tournamentResult && this.gameStep != "") {
      var games = this.localStorageService.getField("tournament")[this.gameStep]!.games
      var isAllOver = this.isAllGameOver(games)
      var isAllLocked = this.isAllGameLocked(games)
      if (isAllOver) {
        this.disableNextButton = true
      } else {
        if (!isAllLocked) {
          this.disableNextButton = true
        }
      }


    }
  }

  isAllGameOver = (games: Game[]) => {
    var gameOver = true
    games.forEach((game: Game) => {
      if (!game.gameOver) {
        gameOver = false
      }
    })

    return gameOver
  }

  isAllGameLocked = (games: Game[]) => {
    var gameLocked = true
    games.forEach((game: Game) => {
      if (!game.locked) {
        gameLocked = false
      }
    })
   
    return gameLocked
  }

  enableSwitchResultHandler = () => {

    this.enableSwitchService.enableSwitch("")
    // enable switch result for only the previous game
    if ((this.gameStep=="game2" && this.selectedStep=="game1") || (this.gameStep=="game3" && this.selectedStep=="game2" ) || (this.gameStep=="game4" && this.selectedStep=="game3" ) ){
      this.enableSwitchService.enableSwitch(this.selectedStep)
    }
   
    
  }

  ngOnDestroy() {
    this.gameServiceSub$.unsubscribe();
    this.tournamentServiceSub$.unsubscribe();
  }

  goNext = () => {
    var tournament = this.localStorageService.getField("tournament")
    if (tournament) {
      var games = this.localStorageService.getField("tournament")[this.gameStep]!.games
      games.forEach((game: Game) => {
        game.gameOver = true
        tournament = this.gameService.updateTournament(game, this.gameStep)
      })
      this.gameService.updateTeams(tournament, this.gameStep)
      var updatedData = this.gameService.updateTournamentWinArray(tournament)
      tournament = updatedData.tournament
      var rankedTeams = updatedData.rankedTeams
      this.localStorageService.saveGameResults(tournament)
      this.localStorageService.setTeams({
        allTeams:rankedTeams
      })
      var newStep = ""

      //TO REPLACE
      if (this.gameStep==Object.keys(GameEnum)[0]){
        newStep = Object.keys(GameEnum)[2]
      }else if (this.gameStep==Object.keys(GameEnum)[2]){
        newStep = Object.keys(GameEnum)[4]
      } else if (this.gameStep==Object.keys(GameEnum)[4]){
        newStep = Object.keys(GameEnum)[6]
      }
      if (newStep!=""){
      this.gameService.nextGame(newStep)
      this.localStorageService.setField("gameStep", newStep)
      this.gameService.setStep(newStep)        
      }else{
        this.notificationService.openNotification({
          message: "Concours terminé, veuillez trouver le récap dans l'onglet CLASSEMENT",
          actionText: 'Fermer',
          type: NotificationType.SUCCESS,
        })
        this.localStorageService.setField("gameEnd", true)
      }
     
    }
  }

  onFilterValueChange = (newValue:any) =>{
    this.filterEmpty = true
    if (newValue.trim()!=""){
      this.filterEmpty = false
    }

    //FILTER FUNCTION
    //filter all teams by name
    var teams = this.localStorageService.getTeams().allTeams
    var games = this.localStorageService.getField("tournament")[this.gameStep]!.games
    var filteredTeams = teams.filter((team:Team)=>{
      return team.player1.includes(newValue) || team.player2.includes(newValue) || team.player3.includes(newValue) || team.team==newValue
    })
    var filteredTeamsId:number[] = []
    filteredTeams.forEach((team:Team)=> {
      filteredTeamsId.push(team.team)
    })
    var filteredGames:Game[]=[]
    filteredTeamsId.forEach((id:number)=>{
      games.forEach((game:Game)=>{
        if (game.team1!.teamId == id || game.team2!.teamId == id) {
          filteredGames.push(game)
        }
      })
    })
    filteredGames = filteredGames.filter((value, index) => filteredGames.indexOf(value) === index)    
    this.games = filteredGames
  }

  onFilterClick = () => {
    if (!this.filterEmpty){
      this.filterEmpty = true
      this.filterText =""
      this.games = this.localStorageService.getField("tournament")[this.gameStep]!.games
    }
  }





}
