import { executeLogin } from "../services/Auth.services";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body
    console.log(email, password)
    try {
        const response = await executeLogin(email, password)
        if (response.state) {
            res.status(response.status).json(response)
        } else {
            res.status(response.status).json(response)
        }
    } catch (error) {
        res.status(400).json(error)
    }
}