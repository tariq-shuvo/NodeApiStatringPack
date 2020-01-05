const express = require('express');
const router = express.Router();

const Project = require('../../../../models/property/Project');

// @route GET api/project
// @description Get Project
// @access Public
router.get('/', async (req, res) => {
    
    try {
        let project = await Project.find({})
    
        res.status(200).json({
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route GET api/project/:projectID
// @description Get Project ID
// @access Public
router.get('/single/:projectID', async (req, res) => { 
    try {
        let project = await Project.findById(req.params.projectID)
    
        res.status(200).json({
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router