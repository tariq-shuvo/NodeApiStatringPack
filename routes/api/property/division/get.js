const express = require('express');
const router = express.Router();

const PropertyDivision = require('../../../../models/property/PropertyDivision');


// @route GET api/property/division
// @description Get all property partition
// @access Public
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

// @route GET api/property/division/single/:partitionID
// @description Get single property partition
// @access Public
router.get('/single/:partitionID', async (req, res) => {
    
    try {
        let propertyDivisions = await PropertyDivision.findById(req.params.partitionID).populate('project', ['name']).populate('property', ['name']).populate('ads_type', ['name'])
    
        res.status(200).json({
            data: propertyDivisions
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route GET api/property/division/table
// @description Get all property partition
// @access Public
router.get('/table', async (req, res) => {
    
    try {
        let propertyDivisions = await PropertyDivision.find({}).select('name').select('price').populate('project', ['name']).populate('property', ['name']).populate('ads_type', ['name'])
    
        res.status(200).json({
            data: propertyDivisions
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router