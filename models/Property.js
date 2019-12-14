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
    agents:[
        {
            id:{
                type: Schema.Types.ObjectId,
                ref: 'admins'
            }
        }
    ],
    price:{
        type: Number,
        required: true
    },
    priceUnit:{
        type: String,
        required: true
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
        phone:[
            {
                number:{
                    type: String
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
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
    create:{
        type: Date,
        default: Date.now
    },
    update:{
        type: Date,
        default: Date.now
    }

})

module.exports = Property = mongoose.model('property', PropertySchema)