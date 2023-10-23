export interface Teams {
    allTeams:Team[]
  }

export interface Team {
    team: number;
    player1:string;
    player2:string;
    player3:string;
    gamePlayed:number;
    win:number;
    lost:number;
    score:number,
    goalAverage:number
  }

  export interface RankedTeam {
    rank: number,
    team:Team
  }