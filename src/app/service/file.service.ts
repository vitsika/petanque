import { Injectable } from "@angular/core";
import { LocalStorageService } from "./localStorage.service";

@Injectable({
    providedIn: 'root'
  })
  export class FileService {
    constructor(private localStorageService: LocalStorageService,
        
      ) { }

  
      exportTournament = () => {
        var tournamentJSON = {
            tournamentInfo: this.localStorageService.getField("tournamentInfo"),
            teams: this.localStorageService.getField("teams"),
            gameStarted: this.localStorageService.getField("gameStarted"),
            tournament: this.localStorageService.getField("tournament"),
            gameEnd: this.localStorageService.getField("gameEnd"),
            gameStep: this.localStorageService.getField("gameStep"),
        }
        const blob = new Blob([JSON.stringify(tournamentJSON)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const tournamentInfo = this.localStorageService.getField("tournamentInfo") 
        const fileName = "[Vitsik@]"+tournamentInfo.name + "_"+tournamentInfo.type+"_"+tournamentInfo.date+".json"
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);    
      }
      
  
    }