const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProgressSchema = new Schema({
    property:{
        type: Schema.Types.ObjectId,
        ref: 'property'
    },
    title:{
        type: String,
        required: true
    },
    images:[
        {
            type: String,
            required: true
        }
    ],
    description: {
        type: String,
        default: true
    },
    progress:{
        type: Number,
        default: null,
        max: 100
    },
    active:{
        type: Boolean,
        default: false
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

module.exports = Progress = mongoose.model('progress', ProgressSchema)