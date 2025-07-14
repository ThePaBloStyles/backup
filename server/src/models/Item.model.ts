import { model, Schema, Document } from 'mongoose'

const itemSchema: Schema = new Schema(
    {
        codeProduct:{
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: [
            {
                date: Date,
                value: {
                    type: Number,
                    required: true
                }
            }
        ],
        img: {
            type: String
        },
        stock: {
            type: Number,
            default: 0
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

const itemModel = model<Document>('Item', itemSchema)

export default itemModel