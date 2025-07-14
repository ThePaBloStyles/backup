import { findClients, reWriteNewClient, writeNewClient } from "../services/Client.services";
import { Request, Response } from "express";

export const getClients = async (req: Request, res: Response) => {
    const clients = await findClients()
    res.status(200).json({state: true, clients})
}

export const createClient = async (req: Request, res: Response) => {
    const newClient: any = req.body
    const response = await writeNewClient(newClient)
    res.status(200).json({state: true, response})
}

export const editClient = async (req: Request, res: Response) => {
    const editedClient: any = req.body
    const response = await reWriteNewClient(editedClient)
    res.status(200).json({state: true, response})
}

