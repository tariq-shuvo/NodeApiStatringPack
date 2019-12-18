const express = require('express');
const router = express.Router();

const Property = require('../../../models/property/Property');


// @route GET api/property
// @description Get all roles
// @access Private
router.get('/', async (req, res) => {
    
    try {
        let properties = await Property.find({})
    
        res.status(200).json({
            data: properties
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router