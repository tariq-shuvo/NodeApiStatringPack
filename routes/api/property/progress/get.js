const express = require('express');
const router = express.Router();

const Progress = require('../../../../models/property/Progress');

// @route GET api/property/progress/:propertyID
// @description Get Property Progress
// @access Public
router.get('/:propertyID', async (req, res) => {
    
    try {
        let progress = await Progress.find({
            property: req.params.propertyID
        })
    
        res.status(200).json({
            data: progress
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Property not found'
            });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/property/progress/single/:processID
// @description Get Single Progress
// @access Public
router.get('/single/:processID', async (req, res) => {
    
    try {
        let progress = await Progress.findById(req.params.processID)
    
        res.status(200).json({
            data: progress
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Progress not found'
            });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router