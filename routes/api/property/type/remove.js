const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const PropertyType = require('../../../../models/property/PropertyType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route DELETE api/order
// @description Remove Role
// @access Private
router.delete('/:typeID', auth, async (req, res) => {
    try {
        let PropertyTypeInfo = await PropertyType.findById(req.params.typeID)

        if(!PropertyTypeInfo){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Property type remove request is invalid'
                  }
                ]
              })
        }

        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }

        await PropertyTypeInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Property type removed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router