const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const IncomeType = require('../../../../models/assessment/IncomeType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route POST api/assessment/income/type
// @description Add Assessment Income Type
// @access Private - admin access
router.post('/', [auth, 
    [
        check('name', 'Income type is required').not().isEmpty()
    ]
], async (req, res) => {
    try {
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

        let details = null
 
        if(req.body.details){
            details = req.body.details
        }

        const {name} = req.body

        const IncomeTypeInfo = new IncomeType({
            name,
            details
        })

        await IncomeTypeInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'New income type successfully',
            data: IncomeTypeInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router