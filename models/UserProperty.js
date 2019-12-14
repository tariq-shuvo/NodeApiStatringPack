const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserPropertySchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    property:{
        type: Schema.Types.ObjectId,
        ref: 'properties'
    },
    payment:{
        totalCost: {
            type: Number
        },
        totalPaid: {
            type: Number
        },
        installment:{
            amount:{
                type: Number
            },
            number:{
                type: Number
            }
        },
        nextDueDate: {
            type: Date,
            required: true
        },
        dueDateDuration:{
            type: Number
        },
        dueDateExtension:{
            type: Number
        },
        transactions:[
            {
                code:{
                    type: String
                },
                method:{
                    type: String
                },
                amount:{
                    type: Number
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        date:{
            type: Date,
            default: Date.now
        }
    },
    delivery:{
        type: Date,
        required: true
    }
})

module.exports = UserProperty = mongoose.model('userproperty', UserPropertySchema)