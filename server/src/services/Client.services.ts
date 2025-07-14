/* import { Client } from "@/interface" */
import { Client } from "@/interfaces/Client.interface"
import clientModel from "@/models/Client.model"

export const findClients = async () => {
    const clients = await clientModel.find({deleted: false})
    return clients
}

export const writeNewClient = async (client: Client) => {
    const newClient = await clientModel.create(client)
    return newClient
}

export const reWriteNewClient = async (client: Client) => {
    const clientEdited = await clientModel.findByIdAndUpdate(client._id, client, {new: true})
    return clientEdited
}