const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
// Load Admin Model
const Admin = require('../../../models/admin/Admin')
// Load gravater
const gravater = require('gravatar')
// Load bcrypt
const bcrypt = require('bcryptjs')
// Load Config
const config = require('config')
// Load uuid 
const uuidv1 = require('uuid')

// @route POST api/admin
// @description Admin Registration
// @access Public
router.post(
  '/',
  [
    check('name', 'Name should not be empty.')
      .not()
      .isEmpty(),
    check('email', 'Email should be in email format.').isEmail(),
    check('password', 'Password should be 6 or more characters.').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
      return res.status(400).json({
        errors: error.array()
      })
    }

    const {name, email, password} = req.body

    let superAdmin = req.body.superAdmin
    if(typeof(req.body.superAdmin) == 'undefined'){
        superAdmin = false
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
        "verify.code": verify
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
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router