const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
// Load User Model
const User = require('../../../models/user/User');
// Load gravater
const gravater = require('gravatar')
// Load bcrypt
const bcrypt = require('bcryptjs')
// Load jwt
const jwt = require('jsonwebtoken')
// Load Config
const config = require('config')
// Load uuid 
const uuidv1 = require('uuid')

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route POST api/users
// @description User Registration
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

    const adminRoles = await getAdminRoleChecking(req.admin.id, 'user')

    if (!adminRoles) {
        return res.status(400).send({
            errors: [
                {
                    msg: 'Account is not authorized to create user'
                }
            ]
        })
    }

    const {name, email, password} = req.body

    const verify = uuidv1()
    try {
      // See if user exsist
      let user = await User.findOne({
        email
      })

      if (user) {
        return res.status(400).send({
          errors: [
            {
              msg: 'User already exists'
            }
          ]
        })
      }

      // Get user gravater
      const avatar = gravater.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password,
        "verify.code": verify
      })

      // Encrypt password
      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecrect'),
        {
          expiresIn: config.get('authTokenExpire')
        },
        (err, token) => {
          if (err) throw err
          res.json({
            token
          })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router