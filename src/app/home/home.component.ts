import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../service/localStorage.service';
import { formatDate } from '@angular/common';
import { TournamentInfo } from '../model/tournamentInfo';
import { InfoService } from '../service/info.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tournamentType:string=""
  tournamentName:string=""
  tournamentDate!:any;

  constructor(private localstorageService:LocalStorageService, private infoService: InfoService,  private notificationService: NotificationService,) { }

  ngOnInit(): void {
  }

  onChangleType(value:any){
    this.tournamentType = value    
    this.tournamentDate = formatDate(new Date(), 'dd-MM-YYYY', 'en-US');
  }

  disableButton =() => {
    return this.tournamentName=="" || this.tournamentType==""
  }

  createTournament =() => {
    if (this.checkIfEvalVersionExpired()) {
      this.notificationService.openNotification({
        message: 'Cette version d\'application est expirée, veuillez contacter l\'éditeur',
        actionText: 'Fermer',
        type: NotificationType.ERROR,
      })
    }else{
      var tournamentInfo:TournamentInfo={
        name:this.tournamentName,
        date:this.tournamentDate,
        type:this.tournamentType
      }
      this.localstorageService.setField("tournamentInfo",tournamentInfo)
      this.infoService.setInfo(tournamentInfo)
    }
   
  }

  checkIfEvalVersionExpired = () => {
    var endEvalDate = new Date("2024-12-3")
    endEvalDate.setHours(23,59,0,0)
    var todayDate = new Date()
    return endEvalDate < todayDate
  }

}
