const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertyRegistrationSchema = new Schema({
    property:{
        type: Schema.Types.ObjectId,
        ref: 'property'
    },
    cs: [
        {
            type: String,
            required: true
        }
    ],
    rs:[
        {
            type: String,
            required: true
        }
    ],
    rs_form: [
        {
            type: String
        } 
    ],
    rejection: [
        {
            type: String
        }
    ],
    rent: [
        {
            type: String
        }
    ],
    dcr: [
        {
            type: String
        }
    ],
    vaia_documents: [
        {
            type: String
        }
    ],
    original_documents: [
        {
            type: String
        }
    ],
    create:{
        type: Date,
        default: Date.now
    },
    update:{
        type: Date,
        default: Date.now
    }
})

module.exports = PropertyRegistration = mongoose.model('propertyregistration', PropertyRegistrationSchema)