const express = require('express')
const router = express.Router()

const {upload, removeNotvalidateFile} = require('../../../lib/helpers')

// Load Middleware
const auth = require('../../../middleware/user/auth')

// Load User model
const User = require('../../../models/user/User');



// @route api/user/picture
// @description Add New Profile Picture
// @access Private
router.put('/picture', [auth, upload.single('file')], async (req, res) => {
  let validationMessage = '';
  const uploadedFileDetails = req.file
  if (uploadedFileDetails.mimetype === 'image/png' || uploadedFileDetails.mimetype === 'image/jpeg') {
    const filesize = parseFloat(uploadedFileDetails.size) / (1024 * 1024)
    if (filesize < 1) {
      try {
        let path = uploadedFileDetails.path.replace('public\\', './')
        let user = await User.findById(req.user.id)
        user.avatar = path.replace(/\\/g, "/")
        await user.save()
        return res.json(user)
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