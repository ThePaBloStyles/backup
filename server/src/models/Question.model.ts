import { model, Schema, Document } from 'mongoose'

const formSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required']
        },
        description: {
            type: String
        },
        sector : {
            type: Schema.Types.ObjectId,
            required: [true, 'Sector is required'],
            ref: 'Sector'
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

const formModel = model<Document>('Form', formSchema)

export default formModel
