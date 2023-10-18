import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../model/tournamentResult';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @Input() game!: Game
  constructor() { }

  ngOnInit(): void {
  }

}
