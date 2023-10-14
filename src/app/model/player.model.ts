export interface Teams {
    allTeams:[]
  }

export interface Team {
    team: number;
    player1:string;
    player2:string;
    gamePlayed:number;
    win:number;
    lost:number;
    score:number
  }