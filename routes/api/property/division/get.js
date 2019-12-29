const express = require('express');
const router = express.Router();

const PropertyDivision = require('../../../../models/property/PropertyDivision');


// @route GET api/property
// @description Get all roles
// @access Private
router.get('/', async (req, res) => {
    
    try {
        let propertyDivisions = await PropertyDivision.find({})
    
        res.status(200).json({
            data: propertyDivisions
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router