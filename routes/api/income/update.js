const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const IncomeAssessment = require('../../../models/assessment/IncomeAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route PUT api/assessment/income
// @description Update Assessment Income
// @access Private - admin access
router.put('/', [auth,
    [
        check('income_id', 'Income id is required').not().isEmpty(),
        check('project', 'Project is required').not().isEmpty(),
        check('property', 'Property is required').not().isEmpty(),
        check('type', 'Income type is required').not().isEmpty(),
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

        let incomeAssessment = await IncomeAssessment.findById(req.body.income_id)

        incomeAssessment.project = project
        incomeAssessment.property = property
        incomeAssessment.type = type
        incomeAssessment.price = price
        incomeAssessment.quantity = quantity
        incomeAssessment.notes = notes
        incomeAssessment.update = Date.now()

        await incomeAssessment.save()
        res.status(200).json({
            type: 'success',
            msg: 'Income updated successfully',
            data: incomeAssessment
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router