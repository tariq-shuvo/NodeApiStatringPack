const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const Role = require('../../../../models/admin/Role');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route DELETE api/order
// @description Remove Role
// @access Private
router.delete('/:roleID', auth, async (req, res) => {
  try {
    const adminRoles = await getAdminRoleChecking(req.admin.id, 'role')

    if (!adminRoles) {
      return res.status(400).send({
        errors: [
          {
            msg: 'Account is not authorized to modify role'
          }
        ]
      })
    }

    let role = await Role.findById(req.params.roleID)

    if (!role) {
      return res.status(400).send({
        errors: [
          {
            msg: 'Role remove request is invalid'
          }
        ]
      })
    }

    await role.remove()

    res.status(200).json({
      type: 'success',
      msg: 'Role removed successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router