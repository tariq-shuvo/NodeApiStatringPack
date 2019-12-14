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
    property:[
        {
            id:{
                type: Schema.Types.ObjectId,
                ref: 'properties'
            },
            payment:{
                totalCost: {
                    type: Number
                },
                totalPaid: {
                    type: Number
                },
                installment:{
                    amount:{
                        type: Number
                    },
                    number:{
                        type: Number
                    }
                },
                nextDueDate: {
                    type: Date,
                    required: true
                },
                dueDateDuration:{
                    type: Number
                },
                dueDateExtension:{
                    type: Number
                },
                transactions:[
                    {
                        code:{
                            type: String
                        },
                        method:{
                            type: String
                        },
                        amount:{
                            type: Number
                        },
                        date: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ],
                date:{
                    type: Date,
                    default: Date.now
                }
            },
            delivery:{
                type: Date,
                required: true
            }
        }
    ],
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
                type: Boolean,
                required: true
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