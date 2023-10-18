import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../service/localStorage.service';
import { Team } from '../model/player.model';
import { GameService } from '../service/game.service';
import { GameEnum } from '../model/game.enum';

@Component({
  selector: 'app-plays',
  templateUrl: './plays.component.html',
  styleUrls: ['./plays.component.scss']
})
export class PlaysComponent implements OnInit {
  allTeams: Team[] = []
  gameSteps: any[] = ["Partie 1", "Partie 2", "Partie 3", "Partie 4"]
  tournament: any = {}
  gameStep: string = ""
  games = []
  defaultStep = <any>""
  selectedStep:string =""


  constructor(private localStorageService: LocalStorageService, private gameService: GameService) {
    this.gameService.getStep().subscribe((step) => {
      this.gameStep = step 
      if (step){
        this.games = this.tournament = this.localStorageService.getField("tournament")[step]!.games
        this.setDefaultStep(step)
      }
    })


  }

  ngOnInit(): void {
    if (this.localStorageService.getTeams()) {
      this.allTeams = this.localStorageService.getTeams().allTeams
      this.tournament = this.localStorageService.getField("tournament")
      this.gameStep = this.localStorageService.getField("gameStep")
      if (this.gameStep) {
        this.games = this.tournament = this.localStorageService.getField("tournament")[this.gameStep]!.games
        this.setDefaultStep(this.gameStep)
      }

    }


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
    var currentStepNumber = this.gameStep.charAt(this.gameStep.length - 1)
    var optionStepNumber = step.charAt(step.length - 1)
    return (optionStepNumber > currentStepNumber) ? true : false
  }





}
