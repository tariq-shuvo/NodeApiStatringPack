const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

// Load gravater
const gravater = require('gravatar')
// Load bcrypt
const bcrypt = require('bcryptjs')
// Load Config
const config = require('config')

const auth = require('../../../middleware/admin/auth');
const Admin = require('../../../models/admin/Admin');

const { getAdminRoleChecking } = require('../../../lib/helpers');
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
        check('active', 'Please mention account active or not.').not().isEmpty(),
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

    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).send({
            errors: [
                {
                    msg: 'Password and confirm password not matched'
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

    try {
      // See if admin exsist
      let admin = await Admin.findOne({
        email
      })

      if (admin.length > 0) {
        if(admin._id !== req.body.admin_id){
            return res.status(400).send({
                errors: [
                  {
                    msg: 'Admin already exists'
                  }
                ]
            })
        }  
      }

      // Get admin gravater
      const avatar = gravater.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      admin = await Admin.findById(req.body.admin_id)

      admin.name = name
      admin.email = email
      admin.avatar = avatar
      admin.superAdmin = superAdmin
      admin.roles = roles
      admin.active = activeAccount

      if(req.body.password)
      {
        // Encrypt password
        const salt = await bcrypt.genSalt(10)
        admin.password = await bcrypt.hash(password, salt)

      }
      

      await admin.save()

      if(superAdmin){
        return res.status(200).json({
            msg: 'Super admin information updated successfully'
        })  
      }

      return res.status(200).json({
          msg: 'Admin information successfully'
      })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router