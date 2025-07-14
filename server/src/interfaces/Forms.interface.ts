import { ObjectId } from "mongoose"
import { Sector } from "./Sector.interface"

export interface Forms {
    question: Question[]
    title: string
    description: string
    sector: Sector | string | ObjectId
}

export interface Question {
    ask: string
    askDescription: string
    answer: any
    answerType: string
}