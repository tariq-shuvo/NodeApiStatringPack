const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    contact:{
        address:{
           type: String
        },
        location:{
           type: String
        },
        city:{
           type: String
        },
        division:{
           type: String
        },
        phone:{
            number:{
                type: String
            },
            verificationCode:{
                type: Number,
                default: null
            },
            status: {
                type: Boolean
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    },
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

module.exports = User = mongoose.model('user', UserSchema);