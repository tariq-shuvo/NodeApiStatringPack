const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertySchema = new Schema({
    code:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    propertyType:{
        type: Schema.Types.ObjectId,
        ref: 'propertytype'
    },
    images:[
        {
            path: {
                type: String,
                required: true
            },
            active:{
                type: Boolean,
                default: false
            }
        }
    ],
    details: {
        type: String,
        required: true
    },
    summery: {
        type: String
    },
    agents: {
        type: [Schema.Types.ObjectId],
        ref: 'admins'
    },
    price:{
        type: Number,
        required: true
    },
    priceUnit:{
        type: String,
        required: true
    },
    discount:{
        type: Number,
        default: 0
    },
    negotiable: {
        type: Boolean,
        default: false
    },
    contact:{
        address:{
           type: String
        },
        location:{
           type: String
        },
        city:{
           type: String
        },
        division:{
           type: String
        },
        phone:{
            type: [String]
        }
    },
    totalArea:{
      type: Number,
      required: true  
    },
    areaUnit:{
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: null
    },
    availability:{
        type: Boolean,
        default: true
    },
    active:{
        type: Boolean,
        default: true
    },
    payment:{
        installment:{
            amount:{
                type: Number
            },
            number:{
                type: Number
            }
        },
        dueDateDuration:{
            type: Number
        },
        dueDateExtension:{
            type: Number
        }
    },
    create:{
        type: Date,
        default: Date.now
    },
    update:{
        type: Date,
        default: null
    }

})

module.exports = Property = mongoose.model('property', PropertySchema)