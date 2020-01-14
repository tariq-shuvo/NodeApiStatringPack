const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const IncomeType = require('../../../../models/assessment/IncomeType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route DELETE api/assessment/income/type
// @description Remove Assessment Income
// @access Private
router.delete('/:typeID', auth, async (req, res) => {
    try {
        let IncomeTypeInfo = await IncomeType.findById(req.params.typeID)

        if(!IncomeTypeInfo){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Income type remove request is invalid'
                  }
                ]
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

        await IncomeTypeInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Income type removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router