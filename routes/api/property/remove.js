const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/admin/auth');
const Property = require('../../../models/property/Property');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route DELETE api/property/:propertyID
// @description Remove Property ID
// @access Private
router.delete('/:propertyID', auth, async (req, res) => {
    try {
        let property = await Property.findById(req.params.propertyID)

        if(!property){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Property remove request is invalid'
                  }
                ]
              })
        }

        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized to remove property'
                    }
                ]
            })
        }

        await property.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Property removed successfully',
            data: property
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router