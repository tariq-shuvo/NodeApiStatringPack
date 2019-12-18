const express = require('express');
const router = express.Router();

const { generateNextCode } = require('../../../lib/helpers')

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../middleware/admin/auth');
const Property = require('../../../models/property/Property');

const { getAdminRoleChecking } = require('../../../lib/helpers');

// @route POST api/role
// @description Add New Role
// @access Private
router.post('/', [auth,
    [
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
        check('payment_due_date_extension', 'Payment date extension is required').not().isEmpty(),
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
                        msg: 'Account is not authorized to create property'
                    }
                ]
            })
        }

        const currentTotalOrders = await Property.countDocuments()
        const nextPropertyID = generateNextCode(currentTotalOrders)

        const propertyInfo = new Property({
            code: nextPropertyID,
            name: req.body.name,
            propertyType: req.body.type,
            images: req.body.images,
            details: req.body.details,
            price: req.body.price,
            priceUnit: req.body.price_unit,
            discount: req.body.discount,
            negotiable: req.body.negotiable,
            contact: {
                address: req.body.contact.address,
                location: req.body.contact.location,
                city: req.body.contact.city,
                division: req.body.contact.division,
            },
            totalArea: req.body.total_area,
            areaUnit: req.body.area_unit,
            level: req.body.level,
            availability: req.body.availability,
            active: req.body.active,
            payment: {
                installment: {
                    amount: req.body.installment_amount,
                    number: req.body.total_installment_number
                },
                dueDateDuration: req.body.payment_due_duration,
                dueDateExtension: req.body.payment_due_date_extension
            }
        })

        propertyInfo.agents = req.body.agents != null ? req.body.agents.split(',').map(agent => agent.trim()) : []

        propertyInfo.contact.phone = req.body.contact.phone != null ? req.body.contact.phone.split(',').map(phone => phone.trim()) : []


        await propertyInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'New Property added successfully',
            data: propertyInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router