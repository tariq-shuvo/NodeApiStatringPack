const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const Progress = require('../../../../models/property/Progress');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route DELETE api/property/progress/:progressID
// @description Remove Property Progress
// @access Private
router.delete('/:progressID', auth, async (req, res) => {
    try {
        let PropertyProgressInfo = await Progress.findById(req.params.progressID)

        if(!PropertyProgressInfo){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Property progress remove request is invalid'
                  }
                ]
              })
        }

        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for property progress'
                    }
                ]
            })
        }

        await PropertyProgressInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Property progress removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router