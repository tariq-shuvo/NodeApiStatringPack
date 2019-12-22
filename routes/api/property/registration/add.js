const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PropertyRegistration = require('../../../../models/property/PropertyRegistration');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route POST api/proverty/type
// @description Add Property Type
// @access Private - admin access
router.post('/', [auth, 
    [
        check('property', 'Property id is required').not().isEmpty(),
        check('cs', 'CS is required').not().isEmpty(),
        check('rs', 'RS is required').not().isEmpty(),
    ]
], async (req, res) => {
    try {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            })
        }

        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }

        
        const {property, cs, rs, rs_form, rejection, rent, dcr, vaia_documents, original_documents} = req.body

        const PropertyRegistrationInfo = new PropertyRegistration({
            property,
            cs,
            rs
        })

        if(rs_form) PropertyRegistrationInfo.rs_form = rs_form
        if(rejection) PropertyRegistrationInfo.rejection = rejection
        if(rent) PropertyRegistrationInfo.rent = rent
        if(dcr) PropertyRegistrationInfo.dcr = dcr
        if(vaia_documents) PropertyRegistrationInfo.vaia_documents = vaia_documents
        if(original_documents) PropertyRegistrationInfo.original_documents = original_documents
        
        await PropertyRegistrationInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'New property type successfully',
            data: PropertyTypeInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router