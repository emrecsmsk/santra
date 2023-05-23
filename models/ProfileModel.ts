import { BirthModel } from "./BirthModel";

export interface ProfileModel {
    id: string,
    birth: string,
    height: string,
    email: string,
    name: string,
    shirtNumber: string,
    position: string,
    preferredFoot: string,
    userName: string,
    followers: string[]
    following: string[]
    teams: string[]
    profilePhoto: string,
    headerPhoto: string
}


