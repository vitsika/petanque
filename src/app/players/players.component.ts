import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, RowValueChangedEvent } from 'ag-grid-community';
import data from '../../data/teams.json';
import { LocalStorageService } from '../service/localStorage.service';
import { Team, Teams } from '../model/player.model';
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
  public rowSelection: 'single' | 'multiple' = 'multiple';







  columnDefs: ColDef[] = [
    { headerName: 'Equipe', field: 'team', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'Joueur1', field: 'player1', editable: true },
    { headerName: 'Joueur2', field: 'player2', editable: true },
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
    editable: false
  };


  rowData: Team[] = [];


  constructor(private localStorageService: LocalStorageService, private playerService: PlayerService) {
    this.playerService.getTeams().subscribe(teams => {
      if (teams) {
        this.rowData = teams.allTeams
      } else {
        this.rowData = []
      }

    })
  }

  ngOnInit(): void {
    var teams = this.localStorageService.getTeams()
    if (teams) {
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
      team: -1,
      player1: "",
      player2: "",
      gamePlayed: 0,
      win: 0,
      lost: 0,
      score: 0
    }
    //get allTeams
    var teams = this.localStorageService.getTeams()
    if (!teams) {
      newTeam.team = 1
    } else {
      newTeam.team = this.getMaxTeamNumber(teams.allTeams) + 1
    }
    this.gridApi.applyTransaction({ add: [newTeam] })
    this.localStorageService.addTeam(newTeam)

  }


  onRemoveAll = () => {
    this.localStorageService.removeAll()
  }

  onRemovePlayer = () => {
    var toRemove = this.gridApi.getSelectedRows()
    this.gridApi.applyTransaction({ remove: toRemove })
    this.setNewTeams()
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    this.setNewTeams()
  }
  getMaxTeamNumber = (teams: Team[]) => {
    var array: number[] = []
    teams.forEach(team => {
      array.push(team.team)
    })
    return Math.max(...array)
  }

  setNewTeams = () => {
    let tmp: Team[] = []
    this.gridApi.getRenderedNodes().forEach(node => {
      tmp.push(node.data)
    })
    var newTeams: Teams = {
      allTeams: tmp
    }
    if (newTeams.allTeams.length==0){
      this.localStorageService?.removeAll()
    }else{
      this.localStorageService?.setTeams(newTeams)
    }
  }


}
