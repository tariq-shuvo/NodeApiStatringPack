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

// @route GET api/property/type/:typeID
// @description Get Single Property Types
// @access Public
router.get('/:typeID', async (req, res) => {
    
    try {
        let PropertyTypes = await PropertyType.findById(req.params.typeID)
    
        res.status(200).json({
            data: PropertyTypes
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid project type'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router