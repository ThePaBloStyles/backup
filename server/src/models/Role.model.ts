import { Role } from '@/interfaces/Role.interface'
import { model, Schema, Document } from 'mongoose'

const roleSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            enum: ['usuario', 'administrador', 'bodeguero'] // roles básicos
        },
        description: {
            type: String
        },
        client: {
            type: Schema.Types.ObjectId,
            required: [true, 'Client is required']
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

const roleModel = model<Role & Document>('Role', roleSchema)

export default roleModel
