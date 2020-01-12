const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/admin/auth');
const Admin = require('../../../models/admin/Admin');

// @route GET api/admin/all
// @description Admin Route
// @access Private
router.get('/all', auth, async (req, res) => {
    try {
        const admin = await Admin.find({}).populate('roles',['name']).select('-password').select('-forgot');
        res.status(200).json(admin);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route GET api/admin/single/:adminID
// @description Admin Single Information Route
// @access Private
router.get('/single/:adminID', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminID).populate('roles',['name']).select('-password').select('-forgot');
        res.status(200).json(admin);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;