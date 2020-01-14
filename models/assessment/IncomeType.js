const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IncomeTypeSchema = new Schema({
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

module.exports = IncomeType = mongoose.model('incometype', IncomeTypeSchema)