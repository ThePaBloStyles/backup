import { model, Schema, Document } from 'mongoose'

const userClientSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client'
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

const userClientModel = model<Document>('User_Client', userClientSchema)

export default userClientModel