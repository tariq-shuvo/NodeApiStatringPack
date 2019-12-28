const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const Progress = require('../../../../models/user/UserProperty');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route POST api/property/progress
// @description Add Property Progress
// @access Private - admin access
router.post('/', [auth, 
    [
        check('property', 'Property id is required').not().isEmpty(),
        check('title', 'Property update title is required').not().isEmpty(),
        check('description', 'Property update description is required').not().isEmpty(),
        check('progress', 'Property update progress required').not().isEmpty()
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


        const {property, title, description, progress} = req.body

        const ProgressInfo = new Progress({
            property,
            title,
            description,
            progress
        })

        await ProgressInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'New progress added successfully',
            data: ProgressInfo
        })
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Property not found'
            });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router