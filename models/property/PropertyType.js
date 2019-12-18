const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertyTypeSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
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

module.exports = PropertyType = mongoose.model('propertytype', PropertyTypeSchema)