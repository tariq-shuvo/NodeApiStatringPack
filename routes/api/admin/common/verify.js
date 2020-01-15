const express = require('express')
const router = express.Router()
// Load Admin Model
const Admin = require('../../../../models/admin/Admin')


// @route GET api/admin/verify
// @description Verification link verify
// @access Public
router.get('/verify/:id', async (req, res)=>{
    const verify = req.params.id;
    try {
        let admin = await Admin.findOne({
            "verify.code": verify
          })

        if(!admin){
            return res.status(404).json({
                msg: 'Invalid verification link'
            });
        }
        admin.verify.status = true
        await admin.save()
        
    
        // req.flash()
        res.status(200).json({
            msg: 'Email verification is completed'
        });   
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router