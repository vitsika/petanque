import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EnableGameService } from './service/enable-game.service';
import { Subscription } from 'rxjs';
import { InfoService } from './service/info.service';
import { TournamentInfo } from './model/tournamentInfo';
import { LocalStorageService } from './service/localStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'petanque';
  enableGames:boolean=false
  private infoServiceSub$!: Subscription
  private enableGameServiceSub$!: Subscription
  infoSet:boolean = false

  constructor(
    private enableGameService: EnableGameService, private infoService: InfoService, private localStorageService: LocalStorageService) {
    var info: TournamentInfo = this.localStorageService.getField("tournamentInfo")
    this.infoSet = info?true:false
    this.enableGameServiceSub$ = this.enableGameService.isEnable().subscribe((enable)=> {
      this.enableGames = enable
    })
  }
  
  ngOnInit(): void {
    this.infoServiceSub$ = this.infoService.getInfo().subscribe((info: TournamentInfo)=>{
      if (info.name!="" && info.date!="" && info.type!=""){
        this.infoSet = true   
      }
    })
  }

  ngOnDestroy(): void {
    this.infoServiceSub$.unsubscribe()
    this.enableGameServiceSub$.unsubscribe()
  }
}
