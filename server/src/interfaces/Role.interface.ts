import { ObjectId } from "mongoose"
import { Client } from "./Client.interface"

export interface Role {
    name: string
    description: string
    client: Client | ObjectId | string
}