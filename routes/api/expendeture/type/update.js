const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const ExpendType = require('../../../../models/assessment/ExpendType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route PUT api/assessment/expend/type
// @description Update Assessment Expendeture Type
// @access Private - admin access
router.put('/', [auth,
    [
        check('type', 'Type id required').not().isEmpty(),
        check('name', 'Assessment expendeture type is required').not().isEmpty()
    ]
], async (req, res) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

    if (!adminRoles) {
        return res.status(400).send({
            errors: [
                {
                    msg: 'Account is not authorized for assessment type'
                }
            ]
        })
    }

    try {
        let details = null

        if (req.body.details) {
            details = req.body.details
        }

        const { name } = req.body

        let expendetureType = await ExpendType.findById(req.body.type)

        expendetureType.name = name
        expendetureType.details = details
        expendetureType.update = Date.now()

        await expendetureType.save()
        res.status(200).json({
            type: 'success',
            msg: 'Expendeture type updated successfully',
            data: expendetureType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router