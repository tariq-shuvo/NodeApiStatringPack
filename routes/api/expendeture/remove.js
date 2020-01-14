const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/admin/auth');
const ExpendAssessment = require('../../../models/assessment/ExpendAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route DELETE api/assessment/expend/:expendID
// @description Remove assessment expendeture
// @access Private
router.delete('/:expendID', auth, async (req, res) => {
    try {
        let ExpendAssessmentInfo = await ExpendAssessment.findById(req.params.expendID)

        if(!ExpendAssessmentInfo){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Expendeture remove request is invalid'
                  }
                ]
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

        await ExpendAssessmentInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Expendeture removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router