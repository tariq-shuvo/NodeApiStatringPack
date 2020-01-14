const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const ExpendAssessment = require('../../../models/assessment/ExpendAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route POST api/assessment/expend
// @description Add Assessment Expendeture
// @access Private - admin access
router.post('/', [auth, 
    [
        check('project', 'Project is required').not().isEmpty(),
        check('property', 'Property is required').not().isEmpty(),
        check('type', 'Expend type is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(),
        check('quantity', 'Quantity is required').not().isEmpty()
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
                        msg: 'Account is not authorized for expendeture assessment'
                    }
                ]
            })
        }

        let notes = null
 
        if(req.body.notes){
            notes = req.body.notes
        }

        const {project, property, type, price, quantity} = req.body

        const expendAssessmentInfo = new ExpendAssessment({
            project, 
            property, 
            type, 
            price, 
            quantity,
            notes
        })

        await expendAssessmentInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'New expendeture added successfully',
            data: expendAssessmentInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router