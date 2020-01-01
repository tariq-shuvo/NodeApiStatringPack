const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const ProjectType = require('../../../../models/property/ProjectType');

// @route DELETE api/project/type/:typeID
// @description Delete Single Project Type
// @access Private
router.delete('/:typeID', auth, async (req, res) => {
    
    try {
        let projectType = await ProjectType.findById(req.params.typeID)
    
        await projectType.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Property type removed successfully'
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