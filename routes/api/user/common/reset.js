const express = require('express')
const router = express.Router()
// Load Express Validator
const {check, validationResult} = require('express-validator')
// Load bcrypt
const bcrypt = require('bcryptjs')
// Load User Model
const User = require('../../../../models/User')

// @route GET api/auth/user/password/reset/:id
// @description Get Password Reset Form
// @access Private
router.get('/reset/:id', async (req, res)=>{
    const forgot_code = req.params.id;
    try {
        let user = await User.findOne({
            "forgot.code": forgot_code
          })

        if(!user){
            return res.status(404).json({
                msg: 'Invalid password reset link'
            });
        }

        res.status(200).json({
            reset_token: forgot_code
        });   
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// @route Post api/auth/user/password/reset
// @description Reset new paasword
// @access Private
router.post('/password/reset', [
    check('password', 'Password should be 6 or more characters.').isLength({
        min: 6
      }).custom((value, {req, loc, path}) => {
        if (value !== req.body.confirm_password) {
            return false;
        } else {
            return value;
        }
    }).withMessage("Passwords don't matched.")
], async (req, res)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        })
    }

    const {password, confirm_password, token} = req.body;
    try {
        let user = await User.findOne({
            "forgot.code": token
          })

        if(!user){
            return res.status(404).json({
                msg: 'Invalid password reset verification link'
            });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        
        user.forgot = {
            status: false,
            date: Date.now()
        }

        await user.save()  
        res.status(200).json({
            success: 'New password has been set successfully'
        });   
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router