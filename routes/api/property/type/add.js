const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PropertyType = require('../../../../models/property/PropertyType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route POST api/proverty/type
// @description Add Property Type
// @access Private - admin access
router.post('/', [auth, 
    [
        check('name', 'Property type is required').not().isEmpty()
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

        let image = null
 
        if(req.body.icon){
            image = req.body.image
        }

        const {name} = req.body

        const PropertyTypeInfo = new PropertyType({
            name,
            image
        })

        await PropertyTypeInfo.save()

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