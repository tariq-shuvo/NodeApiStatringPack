const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const Project = require('../../../../models/property/Project');

const { upload, removeNotvalidateFile, removeUploadedFile, getAdminRoleChecking } = require('../../../../lib/helpers');

// @route PUT api/project
// @description Update project
// @access Private - admin access
// @params project, type, name(required) details, summery(optional)
router.put('/', [auth,
    [
        check('project', 'Project is required').not().isEmpty(),
        check('type', 'Type is required').not().isEmpty(),
        check('name', 'Name is required').not().isEmpty()
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
                    msg: 'Account is not authorized for property'
                }
            ]
        })
    }

    try {
        const {type, name, details, summery} = req.body

        let ProjectInfo = await Project.findById(req.body.project)
        ProjectInfo.type = type.split(',').map(type => type.trim())
        ProjectInfo.name = name
        if(details) ProjectInfo.details = details
        if(summery) ProjectInfo.summery = summery
        ProjectInfo.update = Date.now()

        await ProjectInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Project information updated successfully',
            data: ProjectInfo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route PUT api/project/:projectID/image/upload
// @description upload project image
// @access Private - admin access
router.put('/:projectID/image/upload', [auth, upload.single('file')], async (req, res) => {
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

    let validationMessage = '';
    const uploadedFileDetails = req.file
    if (uploadedFileDetails.mimetype === 'image/png' || uploadedFileDetails.mimetype === 'image/jpeg') {
      const filesize = parseFloat(uploadedFileDetails.size) / (1024 * 1024)
      if (filesize < 1) {
        try {
          let path = uploadedFileDetails.path.replace('public\\', './')
          let project = await Project.findById(req.params.projectID)
          project.images.push(path.replace(/\\/g, "/"))
          await project.save()
          return res.status(200).json(project)
        } catch (error) {
          console.error(error.message)
          return res.status(500).send('Server error')
        }
      } else {
        validationMessage = 'File should not be more than 1 MB.'
        removeNotvalidateFile(res, uploadedFileDetails, validationMessage)
      }
    } else {
      validationMessage = 'Only png and jpg files are allowed.'
      removeNotvalidateFile(res, uploadedFileDetails, validationMessage)
    }
  })


// @route PUT api/project/:projectID/image/remove
// @description remove project image
// @access Private - admin access
router.put('/:projectID/image/remove', [auth, 
    [
        check('image_index', 'Image index is required').not().isEmpty(),
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
                    msg: 'Account is not authorized for property'
                }
            ]
        })
    }

    const {image_index} = req.body

    try {
        let project = await Project.findById(req.params.projectID)

        if(project.images.length <= image_index){
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Image removing index is invalid'
                    }
                ]
            }) 
        }

        let path = project.images[image_index].replace('./', 'public\\').replace(/\\/g, "/")

        project.images = project.images.filter((value, index) => index !== image_index)
        await project.save()
        
        const successInfo ={
            msg: 'Project image removed successfully',
            data: project
        }

        removeUploadedFile(res, path, successInfo)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server error')
    }
})  

module.exports = router