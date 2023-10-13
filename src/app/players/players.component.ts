import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import  data  from '../../data/data.json';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],  
})
export class PlayersComponent implements OnInit {
  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Catch Phrase', field: 'catchPhrase', sortable: true },
    { headerName: 'Catch Phrase', field: 'catchPhrase', sortable: true },
    { headerName: 'Catch Phrase', field: 'catchPhrase', sortable: true }
  ];

  /**
   * Import customers from /data/data.json file
   */
  rowData: Array<{ [key: string]: string | number | object }> = data.customers;

  constructor() { }

  ngOnInit(): void {
    console.log(data)
  }

}
