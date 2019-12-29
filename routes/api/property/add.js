const express = require('express');
const router = express.Router();

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

        const propertyInfo = new Property({
            project: req.body.project,
            projectType: req.body.project_type,
            name: req.body.name,
            details: req.body.details,
            "contact.address": req.body.address,
            "contact.location": req.body.location,
            "contact.city": req.body.city,
            "contact.division": req.body.division,
            "parking.available" : req.body.parking_no
        })

        propertyInfo.agents = req.body.agents != null ? req.body.agents.split(',').map(agent => agent.trim()) : []

        propertyInfo.contact.phone = req.body.phone != null ? req.body.phone.split(',').map(phone => phone.trim()) : []

        if(req.body.summery){
            propertyInfo.summery = req.body.summery
        }

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