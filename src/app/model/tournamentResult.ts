import { Team } from "./player.model"

export interface TournamentResult {
    noWin?:number[],
    oneWin?: number[],
    twoWin?: number[],
    threeWin?: number[],
    fourWin?:number[],
    game1?:GameRecap,
    game2?:GameRecap,
    game3?:GameRecap,
    game4?:GameRecap,
}




export interface Game {
    team1?:{
        teamId:number,
        score:number
    },
    team2?:{
        teamId:number,
        score:number
    },
    gameOver:boolean
}



export interface GameRecap {
    games?:Game[],
    exempt?:Team
}

