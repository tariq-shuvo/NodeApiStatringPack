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

module.exports = router