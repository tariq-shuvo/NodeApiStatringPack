const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpendAssessmentSchema = new Schema({
    project:{
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'property'
    },
    type:{
        type: Schema.Types.ObjectId,
        ref: 'expendtype'
    },
    quantity:{
        type: Number,
        default: 1
    },
    price:{
        type: Number,
        required: true
    },
    notes:{
        type: String,
        default: null
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

module.exports = ExpendAssessmentType = mongoose.model('expendassessment', ExpendAssessmentSchema)