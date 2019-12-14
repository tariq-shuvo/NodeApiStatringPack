const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const Role = require('../../../../models/admin/Role');

// @route PUT api/cart
// @description Update Single product into the cart
// @access Private
router.put('/', [auth,
    [
        check('role', 'Role id required').not().isEmpty(),
        check('name', 'Role name required').not().isEmpty()
    ]
], async (req, res) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    try {
        let icon = null
 
        if(req.body.icon){
            icon = req.body.icon
        }

        const {name} = req.body

        let role = await Role.findById(req.body.role)

        role.name = name
        role.icon = icon
        role.update = Date.now()
     
        await role.save()
        res.status(200).json({
            type: 'success',
            msg: 'Role information updated successfully',
            data: role
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router