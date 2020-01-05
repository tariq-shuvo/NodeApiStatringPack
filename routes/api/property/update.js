const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const Property = require('../../../models/property/Property');


const { upload, removeNotvalidateFile, removeUploadedFile, getAdminRoleChecking } = require('../../../lib/helpers');
// @route PUT api/property
// @description Update property
// @access Private
router.put('/', [auth,
    [
        check('property_id', 'Properrty id is required').not().isEmpty(),
        check('project', 'project id is required').not().isEmpty(),
        check('project_type', 'project type id is required').not().isEmpty(),
        check('agents', 'Agent is required').not().isEmpty(),
        check('name', 'Properrty name is required').not().isEmpty(),
        check('details', 'Property details is required').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('location', 'Location is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('division', 'Division is required').not().isEmpty(),
        check('parking_no', 'Parking number required').not().isEmpty()
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
                    msg: 'Account is not authorized to update property'
                }
            ]
        })
    }

    // return res.json(req.body)

    try {
        let propertyInfo = await Property.findById(req.body.property_id)

        propertyInfo.project = req.body.project
        propertyInfo.projectType = req.body.project_type
        propertyInfo.name = req.body.name
        propertyInfo.details = req.body.details
        propertyInfo.summery = req.body.summery
        propertyInfo.contact.address = req.body.address
        propertyInfo.contact.location = req.body.location
        propertyInfo.contact.city = req.body.city
        propertyInfo.contact.division = req.body.division
        propertyInfo.parking.available = req.body.parking_no
        
        propertyInfo.agents = req.body.agents != null ? req.body.agents.split(',').map(agent => agent.trim()) : []
        propertyInfo.contact.phone = req.body.phone != null ? req.body.phone.split(',').map(phone => phone.trim()) : []
        propertyInfo.update = Date.now()

        await propertyInfo.save()
        res.status(200).json({
            type: 'success',
            msg: 'Product information updated successfully',
            data: propertyInfo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route PUT api/property/:projectID/image/upload
// @description upload project image
// @access Private - admin access
router.put('/:propertyID/image/upload', [auth, upload.single('file')], async (req, res) => {
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
          let path = uploadedFileDetails.path.replace('public\\', '/')
          let property = await Property.findById(req.params.propertyID)
          property.images.push(path.replace(/\\/g, "/"))
          await property.save()
          return res.status(200).json(property)
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


// @route PUT api/property/:projectID/image/remove
// @description remove project image
// @access Private - admin access
router.put('/:propertyID/image/remove', [auth, 
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
        let property = await Property.findById(req.params.propertyID)

        if(property.images.length <= image_index){
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Image removing index is invalid'
                    }
                ]
            }) 
        }

        let path = property.images[image_index].replace('./', 'public\\').replace(/\\/g, "/")

        property.images = property.images.filter((value, index) => index !== image_index)
        await property.save()
        
        const successInfo ={
            msg: 'Project image removed successfully',
            data: property
        }

        removeUploadedFile(res, path, successInfo)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server error')
    }
})  

module.exports = router