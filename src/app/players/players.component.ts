import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import data from '../../data/teams.json';
import { LocalStorageService } from '../service/localStorage.service';
import { Team } from '../model/player.model';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  columnDefs: ColDef[] = [
    { headerName: 'Equipe', field: 'team' },
    { headerName: 'Joueur1', field: 'player1',editable:true },
    { headerName: 'Joueur2', field: 'player2',editable:true },
    { headerName: 'Parties jouées', field: 'gamePlayed' },
    { headerName: 'Parties gagnées', field: 'win' },
    { headerName: 'Parties perdues', field: 'lost' },
    { headerName: 'Score', field: 'score' },
  ];

  defaultColDef = {
    sortable: true,
    cellStyle: { textAlign: 'center' },
    filter: true,
    resizable: true,
    editable:false
  };


  rowData: Team[] = [];

  constructor(private localStorageService: LocalStorageService, private playerService:PlayerService) { 
    this.playerService.getTeams().subscribe(teams => {
      if (teams){
        this.rowData = teams.allTeams
      }else{
        this.rowData = []
      }
      
    })
  }

  ngOnInit(): void {
    var teams =  this.localStorageService.getTeams()
    if (teams){
      this.rowData = teams.allTeams
    }    
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params: any): void {
    params.api.sizeColumnsToFit();
  }

  onAddPlayer = () => {
    var newTeam: Team = {
      team : -1,
      player1:"",
      player2:"",
      gamePlayed:0,
      win:0,
      lost:0,
      score:0
    }
    //get allTeams
    var teams =  this.localStorageService.getTeams()
    if (!teams){
      newTeam.team = 1
    }else{
      newTeam.team = this.getMaxTeamNumber(teams.allTeams)+1
    }
    this.gridApi.applyTransaction({add:[newTeam]})
    this.localStorageService.addTeam(newTeam)

  }


  onRemoveAll = () => {
    this.localStorageService.removeAll()
  }
  getMaxTeamNumber = (teams:Team[]) => {
    var array : number[]=[]
    teams.forEach(team =>{
      array.push(team.team)
    }) 
    return Math.max(...array)
  }


}
