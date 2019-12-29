const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const ProjectType = require('../../../../models/property/ProjectType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route PUT api/project/type
// @description Update Project Type
// @access Private - admin access
// @params type, name (required) image(optional) 
router.put('/', [auth,
    [
        check('type', 'Project type id required').not().isEmpty(),
        check('name', 'Project type is required').not().isEmpty()
    ]
], async (req, res) => {
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
                    msg: 'Account is not authorized for property type'
                }
            ]
        })
    }

    try {
        let image = null

        if (req.body.image) {
            image = req.body.image
        }

        const { name } = req.body

        let projectType = await ProjectType.findById(req.body.type)

        projectType.name = name
        projectType.image = image
        projectType.update = Date.now()

        await projectType.save()
        
        res.status(200).json({
            type: 'success',
            msg: 'Project type updated successfully',
            data: projectType
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router