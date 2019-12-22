const express = require('express');
const router = express.Router();

const {upload, removeNotvalidateFile} = require('../../../../lib/helpers')

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const Progress = require('../../../../models/property/Progress');

const { getAdminRoleChecking } = require('../../../../lib/helpers');
// @route PUT api/property/progress
// @description Update Property Progress
// @access Private - admin access
router.put('/', [auth,
    [
        check('progress_id', 'Progress update id is required').not().isEmpty(),
        check('property', 'Property id is required').not().isEmpty(),
        check('title', 'Property update title is required').not().isEmpty(),
        check('description', 'Property update description is required').not().isEmpty(),
        check('progress', 'Property update progress is required').not().isEmpty()
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
                    msg: 'Account is not authorized for property progress'
                }
            ]
        })
    }

    try {
        const {property, title, description, progress} = req.body

        let progressInfo = await Progress.findById(req.body.progress_id)

        progressInfo.property = property
        progressInfo.title = title
        progressInfo.description = description
        progressInfo.progress = progress
        progressInfo.update = Date.now()

        await progressInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Property progress updated successfully',
            data: progressInfo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route PUT api/property/progress/image/:progress_id
// @description Update Property Progress Image Upload
// @access Private - admin access
router.put('/image/:progress_id', [auth, upload.single('file')], async (req, res) => {
    let validationMessage = '';
    const uploadedFileDetails = req.file
    if (uploadedFileDetails.mimetype === 'image/png' || uploadedFileDetails.mimetype === 'image/jpeg') {
      const filesize = parseFloat(uploadedFileDetails.size) / (1024 * 1024)
      if (filesize < 1) {
        try {
          let path = uploadedFileDetails.path.replace('public\\', './progress/')
          let progressInfo = await Progress.findById(req.params.progress_id)
          progressInfo.images.push(path.replace(/\\/g, "/"))
          await progressInfo.save()
          return res.json(progressInfo)
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

module.exports = router