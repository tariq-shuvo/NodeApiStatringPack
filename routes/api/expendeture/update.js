const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const ExpendAssessment = require('../../../models/assessment/ExpendAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route PUT api/assessment/expend
// @description Update Assessment Expendeture
// @access Private - admin access
router.put('/', [auth,
    [
        check('expend_id', 'Expend id is required').not().isEmpty(),
        check('project', 'Project is required').not().isEmpty(),
        check('property', 'Property is required').not().isEmpty(),
        check('type', 'Expend type is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(),
        check('quantity', 'Quantity is required').not().isEmpty()
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
                    msg: 'Account is not authorized for assessment'
                }
            ]
        })
    }

    try {
        let notes = null
 
        if(req.body.notes){
            notes = req.body.notes
        }

        const {project, property, type, price, quantity} = req.body

        let expendAssessment = await ExpendAssessment.findById(req.body.expend_id)

        expendAssessment.project = project
        expendAssessment.property = property
        expendAssessment.type = type
        expendAssessment.price = price
        expendAssessment.quantity = quantity
        expendAssessment.notes = notes
        expendAssessment.update = Date.now()

        await expendAssessment.save()
        res.status(200).json({
            type: 'success',
            msg: 'Expendeture updated successfully',
            data: expendAssessment
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router