const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserPropertySchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    property:{
        type: Schema.Types.ObjectId,
        ref: 'property'
    },
    partition:{
        type: Schema.Types.ObjectId,
        ref: 'propertydivision'
    },
    payment:{
        totalCost: {
            type: Number
        },
        totalPaid: {
            type: Number,
            default: 0
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
    },
    create: {
        type: Date,
        default: Date.now
    },
    update:{
        type: Date,
        default: Date.now
    }
})

module.exports = UserProperty = mongoose.model('userproperty', UserPropertySchema)