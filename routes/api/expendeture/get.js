const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/admin/auth');
const ExpendAssessment = require('../../../models/assessment/ExpendAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route GET api/assessment/expend
// @description Get Assessment Expendeture
// @access Private
router.get('/', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for expendeture'
                    }
                ]
            })
        }

        let ExpendAssessments = await ExpendAssessment.find({}).populate('project', ['name']).populate('property', ['name']).populate('type', ['name'])
    
        res.status(200).json({
            data: ExpendAssessments
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/assessment/expend/single/:expendID
// @description Get Single Assessment Expendeture
// @access Private
router.get('/single/:expendID', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for expendeture'
                    }
                ]
            })
        }

        let ExpendAssessments = await ExpendAssessment.findById(req.params.expendID).populate('project', ['name']).populate('property', ['name']).populate('type', ['name'])
    
        res.status(200).json({
            data: ExpendAssessments
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid expendeture'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router