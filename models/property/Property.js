const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    projectType: {
        type: Schema.Types.ObjectId,
        ref: 'projecttype'
    },
    agents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'admin'
        }
    ],
    propertyType: [
        {
            type: Schema.Types.ObjectId,
            ref: 'propertytype'
        }
    ],
    images: {
        type: [String]
    },
    details: {
        type: String,
        required: true
    },
    summery: {
        type: String
    },
    contact:{
        address:{
           type: String
        },
        location:{
           id:{
            type: String
           },
           name:{
            type: String
           }
        },
        city:{
            id:{
                type: String
            },
            name:{
                type: String
            }
        },
        division:{
            id:{
                type: String
            },
            name:{
                type: String
            }
        },
        phone:{
            type: [String]
        }
    },
    parking: {
        available: {
            type: Number
        },
        taken: {
            type: Number
        }
    },
    mapLocation:{
        type: String
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
        default: null
    }

})

module.exports = Property = mongoose.model('property', PropertySchema)