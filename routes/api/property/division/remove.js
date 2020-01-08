const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const PropertyDivision = require('../../../../models/property/PropertyDivision');

// @route DELETE api/project/division/:partitionID
// @description Delete Single Project Type
// @access Private
router.delete('/:partitionID', auth, async (req, res) => {
    
    try {
        let propertyPartition = await PropertyDivision.findById(req.params.partitionID)
    
        await propertyPartition.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Property partition removed successfully'
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid property partition'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router