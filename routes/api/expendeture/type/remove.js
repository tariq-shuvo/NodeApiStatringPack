const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const ExpendType = require('../../../../models/assessment/ExpendType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route DELETE api/assessment/expend/type/:typeID
// @description Remove assessment expendeture type
// @access Private
router.delete('/:typeID', auth, async (req, res) => {
    try {
        let ExpendTypeInfo = await ExpendType.findById(req.params.typeID)

        if(!ExpendTypeInfo){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Expendeture type remove request is invalid'
                  }
                ]
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

        await ExpendTypeInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Expendeture type removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router