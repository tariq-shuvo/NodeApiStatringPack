const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectTypeSchema = new Schema({
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
        default: null
    }
})

module.exports = ProjectType = mongoose.model('projecttype', ProjectTypeSchema)