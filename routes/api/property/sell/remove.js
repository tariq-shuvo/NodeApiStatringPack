const express = require('express');
const router = express.Router();

const { getAdminRoleChecking } = require('../../../../lib/helpers');


const auth = require('../../../../middleware/admin/auth');
const UserProperty = require('../../../../models/user/UserProperty');

// @route DELETE api/property/sell/:userID/:propertyID
// @description Remove specific sold property
// @access Private
router.delete('/:userID/:propertyID', auth, async (req, res) => {
    try {
        let PropertySoldInfo = await UserProperty.findOne({
            $and:[
                {
                    user: req.params.userID
                },
                {
                    property: req.params.propertyID
                },
            ]
        })

        if(!PropertySoldInfo){
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

        await PropertySoldInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Property sold information removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router