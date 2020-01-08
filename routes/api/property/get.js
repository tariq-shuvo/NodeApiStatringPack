const express = require('express');
const router = express.Router();

const Property = require('../../../models/property/Property');


// @route GET api/property
// @description Get all property
// @access Public
router.get('/', async (req, res) => {
    
    try {
        let properties = await Property.find({}).populate('propertyType', ['name']).populate('project', ['name'])
    
        res.status(200).json({
            data: properties
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// @route GET api/property
// @description Get all property
// @access Public
router.get('/select', async (req, res) => {
    
    try {
        let properties = await Property.find({}).select('project').select('_id').select('name').populate('propertyType', ['name'])
    
        res.status(200).json({
            data: properties
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route GET api/property/single/:propertyID
// @description Get all property
// @access Public
router.get('/single/:propertyID', async (req, res) => {
    
    try {
        let properties = await Property.findById(req.params.propertyID).populate('propertyType', ['name']).populate('project', ['name'])
    
        res.status(200).json({
            data: properties
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid Property type'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router