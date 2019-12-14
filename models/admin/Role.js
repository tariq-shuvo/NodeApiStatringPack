const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminRoleSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    icon:{
        type: String
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

module.exports = Role = mongoose.model('role', AdminRoleSchema)