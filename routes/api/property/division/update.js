const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PropertyDivision = require('../../../../models/property/PropertyDivision');


const { upload, removeNotvalidateFile, removeUploadedFile, getAdminRoleChecking } = require('../../../../lib/helpers');

// @route PUT api/property
// @description Update property
// @access Private
router.put('/', [auth,
    [
        check('property_divide_id', 'Properrty id is required').not().isEmpty(),
        check('property', 'Properrty id is required').not().isEmpty(),
        check('project_type', 'Project type is is required').not().isEmpty(),
        check('property_type', 'Properrty type is required').not().isEmpty(),
        check('name', 'Properrty name is required').not().isEmpty(),
        check('details', 'Property details is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(),
        check('price_unit', 'Price unit is required').not().isEmpty(),
        check('total_area', 'Total area is required').not().isEmpty(),
        check('area_unit', 'Area unit is required').not().isEmpty(),
        check('installment_amount', 'Payment installment amount is required').not().isEmpty(),
        check('total_installment_number', 'Payment installment no is required').not().isEmpty(),
        check('payment_due_duration', 'Payment installment day interval is required').not().isEmpty(),
        check('payment_due_date_extension', 'Payment date extension is required').not().isEmpty()
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
        let propertyDivisionInfo = await PropertyDivision.findById(req.body.property_divide_id)

        propertyDivisionInfo.name = req.body.name
        propertyDivisionInfo.details = req.body.details
        propertyDivisionInfo.summery = req.body.summery
        propertyDivisionInfo.price = req.body.price
        propertyDivisionInfo.priceUnit = req.body.price_unit
        propertyDivisionInfo.discount = req.body.discount
        propertyDivisionInfo.negotiable = req.body.negotiable
        propertyDivisionInfo.totalArea = req.body.total_area,
        propertyDivisionInfo.areaUnit = req.body.area_unit,
        propertyDivisionInfo.level = req.body.level,
        propertyDivisionInfo.availability = req.body.availability,
        propertyDivisionInfo.active = req.body.active,
        propertyDivisionInfo.payment.installment.amount = req.body.installment_amount,
        propertyDivisionInfo.payment.installment.number = req.body.total_installment_number,
        propertyDivisionInfo.payment.dueDateDuration = req.body.payment_due_duration,
        propertyDivisionInfo.payment.dueDateExtension = req.body.payment_due_date_extension,

       propertyDivisionInfo.update = Date.now()

        await propertyDivisionInfo.save()
        res.status(200).json({
            type: 'success',
            msg: 'Property division information updated successfully',
            data: propertyDivisionInfo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route PUT api/property/division/:divsionID/image/upload
// @description upload property division image
// @access Private - admin access
router.put('/:divsionID/image/upload', [auth, upload.single('file')], async (req, res) => {
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
          let propertyDivisionInfo = await PropertyDivision.findById(req.params.divsionID)
          propertyDivisionInfo.images.push(path.replace(/\\/g, "/"))
          await propertyDivisionInfo.save()
          return res.status(200).json(propertyDivisionInfo)
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


// @route PUT api/project/division/:divsionID/image/remove
// @description remove property division image
// @access Private - admin access
router.put('/:divsionID/image/remove', [auth, 
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
        let propertyDivisionInfo = await PropertyDivision.findById(req.params.divsionID)

        if(propertyDivisionInfo.images.length <= image_index){
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Image removing index is invalid'
                    }
                ]
            }) 
        }

        let path = propertyDivisionInfo.images[image_index].replace('./', 'public\\').replace(/\\/g, "/")

        propertyDivisionInfo.images = propertyDivisionInfo.images.filter((value, index) => index !== image_index)
        await propertyDivisionInfo.save()
        
        const successInfo ={
            msg: 'Project image removed successfully',
            data: propertyDivisionInfo
        }

        removeUploadedFile(res, path, successInfo)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server error')
    }
})  

module.exports = router