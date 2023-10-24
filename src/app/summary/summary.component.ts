import { AfterContentInit, AfterViewInit, Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridReadyEvent, ModelUpdatedEvent } from 'ag-grid-community';
import { TournamentInfo } from '../model/tournamentInfo';
import { LocalStorageService } from '../service/localStorage.service';
import { Subscription } from 'rxjs';
import { PlayerService } from '../service/player.service';
import { RankedTeam, Team, Teams } from '../model/player.model';
import { SummaryService } from '../service/summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  playerServiceSub$!:Subscription
  summaryServiceSub$!:Subscription
  tournamentInfo!:TournamentInfo
  rowData: RankedTeam[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Classement', field: 'rank' },
    { headerName: 'Equipe', field: 'team.team'},
    { headerName: 'Joueur1', field: 'team.player1'  },
    { headerName: 'Joueur2', field: 'team.player2' },
    { headerName: 'Joueur3', field: 'team.player3' },
    { headerName: 'Parties jouées', field: 'team.gamePlayed' },
    { headerName: 'Parties gagnées', field: 'team.win' },
    { headerName: 'Parties perdues', field: 'team.lost' },
    { headerName: 'Score', field: 'team.score' },
    { headerName: 'Goal average', field: 'team.goalAverage' },
  ];

  defaultColDef = {
    cellStyle: { textAlign: 'center' },
    filter: true,
    resizable: true,
    editable: false,
  };
  constructor(private localStorageService: LocalStorageService, private playerService: PlayerService, private summaryService: SummaryService) {
    this.playerServiceSub$ = this.playerService.getTeams().subscribe(teams => {
      var rankedTeams : RankedTeam[] = []
      if (teams) {
        var allTeams = teams.allTeams
        allTeams.forEach((team:Team, index:number) => {
          var rankedTeam:RankedTeam = {
            rank:index+1,
            team:team
          }
          rankedTeams.push(rankedTeam)
        })
        this.rowData = rankedTeams
      } else {
        this.rowData = this.rowData
      }
    })
   this.summaryServiceSub$ = this.summaryService.isRezise().subscribe((resize:boolean)=>{
      if (resize) this.gridApi.sizeColumnsToFit()
    })


   }
  ngOnDestroy(): void {
    this.playerServiceSub$.unsubscribe()
    this.summaryServiceSub$.unsubscribe()
  }
  @HostListener('window:resize')
  onResize(event: any) {
    this.gridApi.sizeColumnsToFit()
  }



  ngOnInit(): void {
    var info:TournamentInfo =  this.localStorageService.getField("tournamentInfo")
    this.tournamentInfo = info
    var type = info.type
    var teams:Teams = this.localStorageService.getTeams()
    var allTeams:Team[]  = []
    if (teams){
      allTeams = this.localStorageService.getTeams().allTeams
    }
    var rankedTeams : RankedTeam[] = []
    allTeams.forEach((team:Team, index:number) => {
      var rankedTeam:RankedTeam = {
        rank:index+1,
        team:team
      }
      rankedTeams.push(rankedTeam)
    })
    this.rowData = rankedTeams
    this.columnDefs.forEach((colDef,index) =>{
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
    })
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;   
    this.gridApi.setColumnDefs(this.columnDefs)
  }

  
  
 

}
