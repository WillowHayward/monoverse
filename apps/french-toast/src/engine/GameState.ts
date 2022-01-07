export type GameState = {
  // Settings
  timer: boolean,
  mode: string,
  deck: string,

  // Universal
  stage: number,

  canStart: boolean,

  players?: any[],
  teams?: {
    unassigned: any[],
    team: any[],
    toastmasters: any[],
    names?: string[]
  },
  currentTeam?: number,
  toastmaster: number,

  scale: any[]

  winners?: any[],
  winner?: any,
  word?: string,
  hints?: any[]
}
