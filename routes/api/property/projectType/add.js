const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const ProjectType = require('../../../../models/property/ProjectType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route POST api/project/type
// @description Add Project Type
// @access Private - admin access
// @params name(required) image(optional)
router.post('/', [auth, 
    [
        check('name', 'Project type name is required').not().isEmpty()
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
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }

        let image = null
 
        if(req.body.icon){
            image = req.body.image
        }

        const {name} = req.body

        const ProjectTypeInfo = new ProjectType({
            name,
            image
        })

        await ProjectTypeInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Project type added successfully',
            data: ProjectTypeInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router