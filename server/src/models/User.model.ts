import { UserProject } from '@/interfaces/User.interface'
import { model, Schema, Document } from 'mongoose'

const userSchema: Schema = new Schema(
    {
        user_id: {
            type: Number
        },
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        lastName: {
            type: String,
            required: [true, 'Lastname is required']
        },
        phone: {
            type: String
        },
        address: {
            type: String
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        password: {
            type: String,
            required: false
        },
        emailVerifiedAt: {
            type: Date,
            default: null,
            required: false
        },
        state: {
            type: Boolean,
            default: true
        },
        image: {
            type: String,
            required: false
        },
        deleted: {
            type: Boolean,
            default: true
        },
        permissions: {
            type: Object
        },
        // roles: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Role'
        //     }
        // ],
        // Para ejemplo simple, puedes usar un solo rol:
        role: {
            type: String,
            enum: ['usuario', 'administrador', 'bodeguero'],
            required: true
        },
        clients: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Client'
            }
        ]
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

const userModel = model<UserProject & Document>('User', userSchema)

export default userModel
