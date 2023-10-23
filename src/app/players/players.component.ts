import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CellEditingStoppedEvent, CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, RowEditingStoppedEvent, RowValueChangedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { LocalStorageService } from '../service/localStorage.service';
import { Team, Teams } from '../model/player.model';
import { PlayerService } from '../service/player.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/notificationType';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { first } from 'rxjs';
import { EnableGameService } from '../service/enable-game.service';
import { TeamService } from '../service/team.service';
import { TournamentResult } from '../model/tournamentResult';
import { GameService } from '../service/game.service';
import { GameEnum } from '../model/game.enum';
import { TournamentInfo } from '../model/tournamentInfo';

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
  enableGametab:boolean=false
  enableAddPlayer:boolean=true
  enableGenerateGame:boolean=true
  tournamentInfo!:TournamentInfo

  columnDefs: ColDef[] = [
    { headerName: 'Equipe', field: 'team', headerCheckboxSelection: true },
    { headerName: 'Joueur1', field: 'player1', editable: true },
    { headerName: 'Joueur2', field: 'player2', editable: true },
    { headerName: 'Joueur3', field: 'player3', editable: true },
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
    editable: false,
  };


  rowData: Team[] = [];


  constructor(private localStorageService: LocalStorageService,
    private playerService: PlayerService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private enableGameService: EnableGameService,
    private gameService:GameService) {
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
    this.columnDefs.forEach((colDef,index) =>{
      if (colDef.headerName=="Joueur1" || colDef.headerName=="Joueur2"  || colDef.headerName=="Joueur3" ){
        colDef.editable=false
      }
      var info:TournamentInfo =  this.localStorageService.getField("tournamentInfo")
      this.tournamentInfo = info
      var type = info.type
      switch (type) {
        case "simple":
          if (colDef.headerName=="Joueur2" || colDef.headerName=="Joueur3"){
            colDef.hide = true
          }
          break;
          case "doublette":
            if (colDef.headerName=="Joueur3"){
              colDef.hide = true
            }
            break;
      
        default:
          break;
      }
      colDef.headerCheckboxSelection = false
    })
    
    this.setEnableGame()
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.enableDisableRemovePlayer()
    var gameStarted = this.localStorageService.getField("gameStarted")
    if (gameStarted){
      this.enableAddPlayer = false
      this.disableDeletePlayer = true
      this.enableGametab = false
      this.enableGameService.setEnable(true)
      this.columnDefs.forEach((colDef,index) =>{
        if (colDef.headerName=="Joueur1" || colDef.headerName=="Joueur2"  || colDef.headerName=="Joueur3" ){
          colDef.editable=false
        }
        var info:TournamentInfo =  this.localStorageService.getField("tournamentInfo")
        var type = info.type
        switch (type) {
          case "simple":
            if (colDef.headerName=="Joueur2" || colDef.headerName=="Joueur3"){
              colDef.hide = true
            }
            break;
            case "doublette":
              if (colDef.headerName=="Joueur3"){
                colDef.hide = true
              }
              break;
        
          default:
            break;
        }
        colDef.headerCheckboxSelection = false
      })
      this.gridApi.setColumnDefs(this.columnDefs)
      this.gridApi.setSuppressRowClickSelection(true)
    }
  }

  onFirstDataRendered(params: any): void {
    params.api.sizeColumnsToFit();
  }

  onAddPlayer = () => {
    var newTeam: Team = {
      team: -1,
      player1: "a",
      player2: "a",
      player3: "a",
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
        content: 'Voulez-vous vraiment supprimer toutes les équipes et annuler les matchs ?',
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res === 'confirm') {
        this.localStorageService.removeAll()
        this.disableDeletePlayer = true        
        this.enableAddPlayer = true
        this.enableGametab = false
        this.enableGameService.setEnable(false)
        this.setEnableGame()
        this.columnDefs.forEach((colDef,index) =>{
          if (colDef.headerName=="Joueur1" || colDef.headerName=="Joueur2" ){
            colDef.editable=true
          }
        })
        this.gridApi.setColumnDefs(this.columnDefs)
        this.gridApi.setSuppressRowClickSelection(false)
        window.location.reload();
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

  onGenerateGames = () => {    
    let dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: 'auto',
      width: '300px',
      disableClose: true,
      data: {
        title: 'Tirage',
        content: 'Voulez vous démarrer le tirage au sort? Attention, après cette action aucun ajout ou modification des équipes n\'est possible',
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe((res) => {
      if (res === 'confirm') {
        this.enableAddPlayer = false
        this.disableDeletePlayer = true
        this.enableGenerateGame = false
        this.enableGameService.setEnable(this.enableGametab)
        this.columnDefs.forEach((colDef,index) =>{
          if (colDef.headerName=="Joueur1" || colDef.headerName=="Joueur2" ){
            colDef.editable=false
          }
          colDef.headerCheckboxSelection = false
        })
        this.gridApi.setColumnDefs(this.columnDefs)
        this.gridApi.setSuppressRowClickSelection(true)
        this.notificationService.openNotification({
          message: 'Vous pouver maintenant démarrer les parties dans l\'onglet \"PARTIES\"',
          actionText: 'Fermer',
          type: NotificationType.SUCCESS,
        })
        this.localStorageService.setField("gameStarted", true)
        this.gameService.initFirstGame()
        this.localStorageService.setField("gameStep", Object.keys(GameEnum)[0])
        this.gameService.setStep(Object.keys(GameEnum)[0])


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
      if (teams.allTeams.length > 5 && !emptyName) {
        enableGame = true
        this.enableGenerateGame = true
      }
    }
    this.enableGametab = enableGame
  }


}
