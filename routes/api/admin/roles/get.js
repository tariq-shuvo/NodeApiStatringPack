const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const Role = require('../../../../models/admin/Role');

// @route GET api/role
// @description Get all roles
// @access Private
router.get('/', auth, async (req, res) => {
    
    try {
        let roles = await Role.find({})
    
        res.status(200).json({
            data: roles
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router