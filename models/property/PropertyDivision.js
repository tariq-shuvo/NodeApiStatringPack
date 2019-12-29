const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertyDivisionSchema = new Schema({
    code:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'property'
    },
    projectType: {
        type: Schema.Types.ObjectId,
        ref: 'projecttype'
    },
    propertyType:{
        type: Schema.Types.ObjectId,
        ref: 'propertytype'
    },
    ads_type:{
        type: String,
        required: true
    },
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
        default: true
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

module.exports = PropertyDivision = mongoose.model('propertydivision', PropertyDivisionSchema)