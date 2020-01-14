const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const IncomeType = require('../../../../models/assessment/IncomeType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route PUT api/assessment/income/type
// @description Update Assessment Income Type
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

    const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

    if (!adminRoles) {
        return res.status(400).send({
            errors: [
                {
                    msg: 'Account is not authorized for income type'
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

        let incomeType = await IncomeType.findById(req.body.type)

        incomeType.name = name
        incomeType.details = details
        incomeType.update = Date.now()

        await incomeType.save()
        res.status(200).json({
            type: 'success',
            msg: 'Income type updated successfully',
            data: incomeType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router