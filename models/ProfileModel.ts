import { BirthModel } from "./BirthModel";

export interface ProfileModel {
    teams: string[],
    birth: BirthModel,
    followers: string[],
    following: string[],
    height: number,
    mail: string,
    name: string,
    number: number,
    position: string,
    preferredFoot: string,
    userName: string
}


