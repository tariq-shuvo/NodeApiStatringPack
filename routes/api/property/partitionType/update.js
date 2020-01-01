const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PartitionType = require('../../../../models/property/partitionType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route PUT api/partition/type
// @description Update Partition Type
// @access Private - admin access
// @params type, name (required) image(optional) 
router.put('/', [auth,
    [
        check('type', 'Project type id required').not().isEmpty(),
        check('name', 'Project type is required').not().isEmpty()
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

        let partitionType = await PartitionType.findById(req.body.type)

        partitionType.name = name
        partitionType.image = image
        partitionType.update = Date.now()

        await partitionType.save()
        
        res.status(200).json({
            type: 'success',
            msg: 'Partition type updated successfully',
            data: partitionType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router