const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const Admin = require('../../../models/admin/Admin');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route PUT api/role
// @description Update Role
// @access Private
router.put('/', [auth,
    [
        check('admin_id', 'Admin id is required').not().isEmpty(),
        check('name', 'Name should not be empty.')
          .not()
          .isEmpty(),
        check('email', 'Email should be in email format.').isEmail(),
        check('roles', 'Role should not be empty.').not().isEmpty()
    ]
], async (req, res) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
      return res.status(400).json({
        errors: error.array()
      })
    }

    const adminRoles = await getAdminRoleChecking(req.admin.id, 'admin')

    if (!adminRoles) {
        return res.status(400).send({
            errors: [
                {
                    msg: 'Account is not authorized to create admin'
                }
            ]
        })
    }

    let roles = req.body.roles.split(',').map(role => role.trim())

    const {name, email, password} = req.body

    let superAdmin = req.body.superAdmin
    if(typeof(req.body.superAdmin) == 'undefined'){
        superAdmin = false
    }

    let activeAccount = req.body.active
    if(typeof(req.body.active) == 'undefined'){
      activeAccount = true
    }

    const verify = uuidv1()
    try {
      // See if admin exsist
      let admin = await Admin.findOne({
        email
      })

      if (admin) {
        return res.status(400).send({
          errors: [
            {
              msg: 'Admin already exists'
            }
          ]
        })
      }

      // Get admin gravater
      const avatar = gravater.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      admin = new Admin({
        name,
        email,
        avatar,
        password,
        superAdmin,
        roles,
        "verify.code": verify,
        active: activeAccount
      })

      // Encrypt password
      const salt = await bcrypt.genSalt(10)

      admin.password = await bcrypt.hash(password, salt)

      await admin.save()

      if(superAdmin){
        return res.status(200).json({
            msg: 'Super admin registered successfully'
        })  
      }

      return res.status(200).json({
          msg: 'Admin registered successfully'
      })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router