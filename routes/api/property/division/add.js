const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const PropertyDivision = require('../../../../models/property/PropertyDivision');

const { getAdminRoleChecking, generateNextCode } = require('../../../../lib/helpers');

// @route POST api/property/division
// @description Add New Details User a Property
// @access Private
router.post('/', [auth,
    [
        check('project', 'Project id is required').not().isEmpty(),
        check('property', 'Properrty id is required').not().isEmpty(),
        check('project_type', 'Project type is is required').not().isEmpty(),
        check('property_type', 'Properrty type is required').not().isEmpty(),
        check('name', 'Properrty name is required').not().isEmpty(),
        check('summery', 'Property summery is required').not().isEmpty(),
        check('details', 'Property details is required').not().isEmpty(),
        check('ads_type', 'Ads type is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(),
        check('price_unit', 'Price unit is required').not().isEmpty(),
        check('total_area', 'Total area is required').not().isEmpty(),
        check('area_unit', 'Area unit is required').not().isEmpty()
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

        const currentTotalOrders = await PropertyDivision.countDocuments()
        const nextPropertyID = generateNextCode(currentTotalOrders)

        const propertyDivisionInfo = new PropertyDivision({
            project: req.body.project,
            property: req.body.property,
            projectType: req.body.project_type,
            propertyType: req.body.property_type,
            ads_type: req.body.ads_type,
            code: nextPropertyID,
            name: req.body.name,
            summery: req.body.summery,
            details: req.body.details,
            price: req.body.price,
            priceUnit: req.body.price_unit,
            discount: req.body.discount,
            negotiable: req.body.negotiable,
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

        if(req.body.garage_availability){
            propertyDivisionInfo.garage.availability = req.body.garage_availability
            propertyDivisionInfo.garage.price = req.body.garage_price
        }

        await propertyDivisionInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Property partition created successfully',
            data: propertyDivisionInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router