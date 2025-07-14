import { model, Schema, Document } from 'mongoose'

const itemSchema: Schema = new Schema(
    {
        codeProduct:{
            type: String
        },
        brand: {
            type: String
        },
        code: {
            type: String
        },
        name: {
            type: String
        },
        price: [
            {
                date: Date,
                value: {
                    type: Number
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