const express = require('express')
const router = express.Router()
// Load jwt
const jwt = require('jsonwebtoken')
// Load Config 
const config = require('config')
// Load Admin Model
const Admin = require('../../../../models/admin/Admin')
// Load Express Validator
const {check, validationResult} = require('express-validator')
// Load uuidv1
const uuidv1 = require('uuid')


// @route Post api/admin/password/forgot
// @description Reset new paasword
// @access Public
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
        let admin = await Admin.findOne({
            email
          })

        if(!admin){
            return res.status(404).json({
                msg: 'Your email is not registered yet'
            });
        }

        admin.forgot = {
            code: uuidv1(),
            status: false,
            date: Date.now()
        }

        await admin.save()  

        res.status(200).json({
            success: "Password reset link has been sent to your email"
        });

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router