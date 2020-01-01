const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PartitionType = require('../../../../models/property/partitionType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route POST api/project/type
// @description Add Project Type
// @access Private - admin access
// @params name(required) image(optional)
router.post('/', [auth, 
    [
        check('name', 'Project type name is required').not().isEmpty()
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

        const PartitionTypeInfo = new PartitionType({
            name,
            image
        })

        await PartitionTypeInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Partition type added successfully',
            data: PartitionTypeInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router