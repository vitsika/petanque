import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import data from '../../data/teams.json';
import { LocalStorageService } from '../service/localStorage.service';
import { Team } from '../model/player.model';

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

  constructor(private localStorageService: LocalStorageService) { }

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
    this.gridApi.applyTransaction({add:[{}]})
  }


}
