const express = require('express');
const router = express.Router();

const PartitionType = require('../../../../models/property/partitionType');

// @route GET api/partition/type
// @description Get Partition Type
// @access Public
router.get('/', async (req, res) => {
    
    try {
        let partitionType = await PartitionType.find({})
    
        res.status(200).json({
            data: partitionType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/partition/type/:typeID
// @description Get Single Partition Type
// @access Public
router.get('/:typeID', async (req, res) => {
    
    try {
        let partitionType = await PartitionType.findById(req.params.typeID)
    
        res.status(200).json({
            data: partitionType
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid partition type'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router