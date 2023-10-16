import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CellEditingStoppedEvent, CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, RowEditingStoppedEvent, RowValueChangedEvent, SelectionChangedEvent } from 'ag-grid-community';
import data from '../../data/teams.json';
import { LocalStorageService } from '../service/localStorage.service';
import { Team, Teams } from '../model/player.model';
import { PlayerService } from '../service/player.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { first } from 'rxjs';
import { EnableGameService } from '../service/enable-game.service';

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
  disableDeletePlayer: boolean = true







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


  constructor(private localStorageService: LocalStorageService,
    private playerService: PlayerService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private enableGameService: EnableGameService) {
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
      this.disableDeletePlayer = false
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.enableDisableRemovePlayer()
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
    this.setEnableGame()

  }


  onRemoveAll = () => {
    let dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: 'auto',
      width: '300px',
      disableClose: true,
      data: {
        title: 'Suppression des équipes',
        content: 'Voulez-vous vraiment supprimer toutes les équipes ?',
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res === 'confirm') {
        this.localStorageService.removeAll()
        this.disableDeletePlayer = true
        this.setEnableGame()
      }
    });

  }

  onRemovePlayer = () => {
    let dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: 'auto',
      width: '300px',
      disableClose: true,
      data: {
        title: 'Suppression des équipes',
        content: 'Voulez-vous vraiment supprimer les équipes séléctionées ?',
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res === 'confirm') {
        this.disableDeletePlayer = false
        var toRemove = this.gridApi.getSelectedRows()
        this.gridApi.applyTransaction({ remove: toRemove })
        this.setNewTeams()
        if (this.gridApi.getSelectedRows().length == 0) {
          this.disableDeletePlayer = true
        }
        this.setEnableGame()
      }
    });


  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    this.setNewTeams()
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.enableDisableRemovePlayer()
  }


  onCellEditingStopped(event: CellEditingStoppedEvent) {
    if (event.value == "") {
      this.notificationService.openNotification({
        message: 'Attention, le nom est vide.',
        actionText: 'Fermer',
        type: NotificationType.WARNING,
      })
    }
    this.setEnableGame()

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
    if (newTeams.allTeams.length == 0) {
      this.localStorageService?.removeAll()
    } else {
      this.localStorageService?.setTeams(newTeams)
    }
  }

  enableDisableRemovePlayer = () => {
    this.disableDeletePlayer = false
    if (this.gridApi.getSelectedRows().length == 0) {
      this.disableDeletePlayer = true
    }
  }

  setEnableGame = () => {
    var allNodes = this.gridApi.getRenderedNodes()
    var emptyName: boolean = false
    var enableGame: boolean = false
    var teams = this.localStorageService.getTeams()
    if (teams) {
      teams.allTeams.forEach(node => {
        var team = node
        if (team.player1.trim() == "" || team.player2.trim() == "") {
          emptyName = true
        }
      })
      if (allNodes.length > 2 && !emptyName) {
        enableGame = true
      }
    }
    this.enableGameService.setEnable(enableGame)
  }


}
