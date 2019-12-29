const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const Project = require('../../../../models/property/Project');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route POST api/project
// @description Add Project
// @access Private - admin access
// @params name, type(Required) details, summery(Optional)
router.post('/', [auth, 
    [
        check('type', 'Type is required').not().isEmpty(),
        check('name', 'Name is required').not().isEmpty()
    ]
], async (req, res) => {
    try {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            })
        }

        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for project'
                    }
                ]
            })
        }

        
        const {type, name, details, summery} = req.body

        const ProjectInfo = new Project({
            name
        })

        if(type) ProjectInfo.type = type.split(',').map(type => type.trim())
        if(details) ProjectInfo.details = details
        if(summery) ProjectInfo.summery = summery
        
        await ProjectInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Project information added successfully',
            data: ProjectInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router