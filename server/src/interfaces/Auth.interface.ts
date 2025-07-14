import { ObjectId } from "mongoose"

export interface DataStoredInToken {
    _id: ObjectId | string
}

export interface TokenData {
    token: string
    expiresIn: number
}
