import { BirthModel } from "./BirthModel";

export interface PostModel {
    postId: string,
    userId: string,
    description: string,
    postPhoto: string,
    likes: string[],
}
