import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../model/tournamentResult';
import { LocalStorageService } from '../service/localStorage.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @Input() game!: Game
  @Input() selectedStep!: string
  done:boolean=false
  constructor(private localStorageService:LocalStorageService) {
   
   }

  ngOnInit(): void {   
    var currentStep =  this.localStorageService.getField("gameStep")
    if (currentStep!=this.selectedStep){
      this.game.gameOver=true
    }
  }

}
