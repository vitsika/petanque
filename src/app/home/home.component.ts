import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../service/localStorage.service';
import { formatDate } from '@angular/common';
import { TournamentInfo } from '../model/tournamentInfo';
import { InfoService } from '../service/info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tournamentType:string=""
  tournamentName:string=""
  tournamentDate!:any;

  constructor(private localstorageService:LocalStorageService, private infoService: InfoService) { }

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
    var tournamentInfo:TournamentInfo={
      name:this.tournamentName,
      date:this.tournamentDate,
      type:this.tournamentType
    }
    this.localstorageService.setField("tournamentInfo",tournamentInfo)
    this.infoService.setInfo(tournamentInfo)
  }

}
