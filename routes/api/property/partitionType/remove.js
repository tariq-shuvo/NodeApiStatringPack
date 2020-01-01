const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const PartitionType = require('../../../../models/property/partitionType');

// @route DELETE api/partition/type/:typeID
// @description Delete Single Partition Type
// @access Private
router.delete('/:typeID', auth, async (req, res) => {
    
    try {
        let partitionType = await PartitionType.findById(req.params.typeID)
    
        await partitionType.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Partition type removed successfully'
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