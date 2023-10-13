import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LibModule } from './lib/lib.module';
import { PlayersComponent } from './players/players.component';
import { PlaysComponent } from './plays/plays.component';
import { SummaryComponent } from './summary/summary.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlaysComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LibModule,
    AgGridModule ],
    
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
