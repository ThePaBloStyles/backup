import { Client } from '@/interfaces/Client.interface'
import { model, Schema, Document } from 'mongoose'

const clientSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        address: {
            type: String
        },
        phone: {
            type: String
        },
        city: {
            type: String
        },
        region: {
            type: String
        },
        country: {
            type: String
        },
        state: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
)

const clientModel = model<Client & Document>('Client', clientSchema)

export default clientModel
