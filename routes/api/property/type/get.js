const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const PropertyType = require('../../../../models/property/PropertyType');

// @route GET api/property/type
// @description Get Property Types
// @access Public
router.get('/', async (req, res) => {
    
    try {
        let PropertyTypes = await PropertyType.find({})
    
        res.status(200).json({
            data: PropertyTypes
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router