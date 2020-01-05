const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const Project = require('../../../../models/property/Project');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route Delete api/project/:projectID
// @description Remove Project
// @access Private - admin access
// @params no parameters are needed
router.delete('/:projectID', auth, async (req, res) => {
    const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

    if (!adminRoles) {
        return res.status(400).send({
            errors: [
                {
                    msg: 'Account is not authorized for property'
                }
            ]
        })
    }

    try {
        let ProjectInfo = await Project.findById(req.params.projectID)

        await ProjectInfo.remove()

        res.status(200).json({
            type: 'success',
            msg: 'Project removed successfully',
            data: ProjectInfo
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid project'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router