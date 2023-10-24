import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EnableGameService } from './service/enable-game.service';
import { Subscription, first } from 'rxjs';
import { InfoService } from './service/info.service';
import { TournamentInfo } from './model/tournamentInfo';
import { LocalStorageService } from './service/localStorage.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SummaryService } from './service/summary.service';
import { ReloadService } from './service/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { InfoModalComponent } from './info-modal/info-modal.component';

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
  private reloadServiceSub$!: Subscription
  infoSet:boolean = false

  constructor(
    private enableGameService: EnableGameService, private infoService: InfoService, private localStorageService: LocalStorageService, private summaryService:SummaryService, 
    private reloadService:ReloadService, 
    private dialog: MatDialog) {
    var info: TournamentInfo = this.localStorageService.getField("tournamentInfo")
    this.infoSet = info?true:false
    this.enableGameServiceSub$ = this.enableGameService.isEnable().subscribe((enable)=> {
      this.enableGames = enable
    })
    this.reloadServiceSub$ = this.reloadService.isReload().subscribe((reload:boolean)=> {
      if (reload)this.infoSet = false   
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
    this.reloadServiceSub$.unsubscribe()
  }

  onTabChanged(index: number) {
    //workarround for fit grid api in summary tab
    if (index==2) this.summaryService.setResize(true)
 } 

 onClickInfo = () => {
  let dialogRef = this.dialog.open(InfoModalComponent, {
    height: 'auto',
    width: '60vw',
    disableClose: true,
    data: {
      title: 'Information',
      content: 'Cet outil sert à générer aléatoirement des parties lors d\'un coucncours de pétanque en 4 parties.<br/>Les règles sont les suivantes: <ul><li>les parties ne peuvent commencer que si il y a au moins 2 équipes.</li><li>Si le nombre d\'équipe est impaire, on tire au sort une équipe qui sera exempte pour chaque partie. Léquipe tirée au sort sera la gagnante avec un score de 13 à 0.</li><li>Pour chaque partie, si le nombre d\'équipe gagnante ou perdante est impaire, l\'équipe gagnante avec le plus faible "goal average" rencontrera l\'équipe perdante avec le plus haut "goal average"</li><li> Le système de classement sera fait en fonction du nombre de victoire. Si plusieurs équipes ont le même nombre de victoire, le classement sera basé sur le "goal average"</li></ul>'
      
      
    },
  })
 }
}
