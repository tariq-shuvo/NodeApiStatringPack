const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/admin/auth');
const IncomeAssessment = require('../../../models/assessment/IncomeAssessment');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route DELETE api/assessment/income/:incomeID
// @description Remove assessment incomeeture
// @access Private
router.delete('/:incomeID', auth, async (req, res) => {
    try {
        let IncomeAssessmentInfo = await IncomeAssessment.findById(req.params.incomeID)

        if(!IncomeAssessmentInfo){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Incomeeture remove request is invalid'
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

        await IncomeAssessmentInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Income removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router