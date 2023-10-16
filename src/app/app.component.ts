import { Component, ViewEncapsulation } from '@angular/core';
import { EnableGameService } from './service/enable-game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'petanque';
  enableGames:boolean=false


  constructor(
    private enableGameService: EnableGameService) {
    this.enableGameService.isEnable().subscribe((enable)=> {
      this.enableGames = enable
    })
  }
}
