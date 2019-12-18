const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const Property = require('../../../models/property/Property');


const { getAdminRoleChecking } = require('../../../lib/helpers');
// @route PUT api/property
// @description Update property
// @access Private
router.put('/', [auth,
    [
        check('property_id', 'Properrty id is required').not().isEmpty(),
        check('name', 'Properrty name is required').not().isEmpty(),
        check('type', 'Property type is required').not().isEmpty(),
        check('images', 'Property image is required').not().isEmpty(),
        check('details', 'Property details is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(),
        check('price_unit', 'Price unit is required').not().isEmpty(),
        check('contact', 'Contact information required').not().isEmpty(),
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
        let propertyInfo = await Property.findById(req.body.property_id)

        propertyInfo.name = req.body.name
        propertyInfo.propertyType = req.body.type
        propertyInfo.images = req.body.images
        propertyInfo.details = req.body.details
        propertyInfo.summery = req.body.summery
        propertyInfo.price = req.body.price
        propertyInfo.priceUnit = req.body.price_unit
        propertyInfo.discount = req.body.discount
        propertyInfo.negotiable = req.body.negotiable
        propertyInfo.contact.address = req.body.contact.address
        propertyInfo.contact.location = req.body.contact.location
        propertyInfo.contact.city = req.body.contact.city
        propertyInfo.contact.division = req.body.contact.division
        propertyInfo.totalArea = req.body.total_area,
            propertyInfo.areaUnit = req.body.area_unit,
            propertyInfo.level = req.body.level,
            propertyInfo.availability = req.body.availability,
            propertyInfo.active = req.body.active,
            propertyInfo.payment.installment.amount = req.body.installment_amount,
            propertyInfo.payment.installment.number = req.body.total_installment_number,
            propertyInfo.payment.dueDateDuration = req.body.payment_due_duration,
            propertyInfo.payment.dueDateExtension = req.body.payment_due_date_extension,

            propertyInfo.agents = req.body.agents != null ? req.body.agents.split(',').map(agent => agent.trim()) : []
        propertyInfo.contact.phone = req.body.contact.phone != null ? req.body.contact.phone.split(',').map(phone => phone.trim()) : []
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

module.exports = router