const express = require('express')
const router = express.Router()
// Load jwt
const jwt = require('jsonwebtoken')
// Load Config 
const config = require('config')
// Load User Model
const User = require('../../../../models/user/User');
// Load Express Validator
const {check, validationResult} = require('express-validator')
// Load uuidv1
const uuidv1 = require('uuid')


// @route Post api/auth/user/password/forgot
// @description Reset new paasword
// @access Private
router.post('/forgot', [
    check('email', 'Email should be in email format').isEmail()
], async (req, res)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        })
    }

    const { email } = req.body

    try {
        let user = await User.findOne({
            email
          })

        if(!user){
            return res.status(404).json({
                msg: 'Your email is not registered yet'
            });
        }

        user.forgot = {
            code: uuidv1(),
            status: false,
            date: Date.now()
        }

        await user.save()  

        res.status(200).json({
            success: "Password reset link has been sent to your email"
        });
        // // Return jsonwebtoken
        // const payload = {
        //     user: {
        //     id: user.id
        //     }
        // }

        // jwt.sign(
        //     payload,
        //     config.get('jwtSecrect'),
        //     {
        //     expiresIn: config.get('authTokenExpire')
        //     },
        //     (err, token) => {
        //     if (err) throw err
        //     res.json({
        //         token
        //     })
        //     }
        // )

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router