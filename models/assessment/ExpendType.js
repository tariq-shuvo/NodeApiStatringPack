const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpendTypeSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    details: {
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

module.exports = ExpendType = mongoose.model('expendtype', ExpendTypeSchema)