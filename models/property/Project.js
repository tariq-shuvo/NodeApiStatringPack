const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    images: {
        type: [String]
    },
    type: {
        type: [Schema.Types.ObjectId],
        ref: 'projecttype'
    },
    details: {
        type: String
    },
    summery: {
        type: String
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

module.exports = Project = mongoose.model('project', ProjectSchema)