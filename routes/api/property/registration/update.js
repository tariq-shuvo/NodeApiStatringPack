const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PropertyType = require('../../../../models/property/PropertyRegistration');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route PUT api/property/type
// @description Update Property Type
// @access Private - admin access
router.put('/', [auth,
    [
        check('type', 'Type id required').not().isEmpty(),
        check('name', 'Property type is required').not().isEmpty()
    ]
], async (req, res) => {
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

    try {
        let image = null

        if (req.body.image) {
            image = req.body.image
        }

        const { name } = req.body

        let propertyType = await PropertyType.findById(req.body.type)

        propertyType.name = name
        propertyType.image = image
        propertyType.update = Date.now()

        await propertyType.save()
        res.status(200).json({
            type: 'success',
            msg: 'Property type updated successfully',
            data: propertyType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router