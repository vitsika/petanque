import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LibModule } from './lib/lib.module';
import { PlayersComponent } from './players/players.component';
import { PlaysComponent } from './plays/plays.component';
import { SummaryComponent } from './summary/summary.component';
import { AgGridModule } from 'ag-grid-angular';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import {MatCardModule} from '@angular/material/card';
import { PlayComponent } from './play/play.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlaysComponent,
    SummaryComponent,
    ConfirmModalComponent,
    PlayComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LibModule,
    AgGridModule,
    MatCardModule ],
    
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
