const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    superAdmin:{
        type: Boolean,
        required: true,
        default: false
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'role'
        }
    ],
    verify:{
        code: {
         type: String,
         require: true   
        },
        status: {
            type: Boolean,
            require: true,
            default: false
        },
        date:{
            type: Date,
            default: Date.now
        }
    },
    forgot:{
        code: {
         type: String  
        },
        status: {
            type: Boolean
        },
        date:{
            type: Date
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    create:{
        type: Date,
        default: Date.now
    },
    update:{
        type: Date,
        default: Date.now
    }
});

module.exports = Admin = mongoose.model('admin', AdminSchema);