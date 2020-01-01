const express = require('express');
const router = express.Router();

const ProjectType = require('../../../../models/property/ProjectType');

// @route GET api/project/type
// @description Get Project Type
// @access Public
router.get('/', async (req, res) => {
    
    try {
        let projectType = await ProjectType.find({})
    
        res.status(200).json({
            data: projectType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/project/type/:typeID
// @description Get Single Project Type
// @access Public
router.get('/:typeID', async (req, res) => {
    
    try {
        let projectType = await ProjectType.findById(req.params.typeID)
    
        res.status(200).json({
            data: projectType
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