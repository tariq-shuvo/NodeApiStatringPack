const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/admin/auth');
const IncomeAssessment = require('../../../models/assessment/IncomeAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route GET api/assessment/income
// @description Get Assessment Incomeeture
// @access Private
router.get('/', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for income'
                    }
                ]
            })
        }

        let IncomeAssessments = await IncomeAssessment.find({}).populate('project', ['name']).populate('property', ['name']).populate('type', ['name'])
    
        res.status(200).json({
            data: IncomeAssessments
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/assessment/income/single/:incomeID
// @description Get Single Assessment Incomeeture
// @access Private
router.get('/single/:incomeID', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for income'
                    }
                ]
            })
        }

        let IncomeAssessments = await IncomeAssessment.findById(req.params.incomeID).populate('project', ['name']).populate('property', ['name']).populate('type', ['name'])
    
        res.status(200).json({
            data: IncomeAssessments
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid income'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router