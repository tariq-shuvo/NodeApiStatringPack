const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const UserProperty = require('../../../../models/user/UserProperty');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route GET api/property/sell/:userID/:propertyID
// @description Get Sold Property Infornmation
// @access Private - admin access
router.get('/:userID/:propertyID', auth, async (req, res) => {
    try {

        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }

        let userPropertyInfo = await UserProperty.find({
            $and:[
                {
                    user: req.params.userID
                },
                {
                    property: req.params.propertyID
                },
            ]
        })
    
        res.status(200).json({
            data: userPropertyInfo
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Property and user not found'
            });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/property/sell/property/:userID
// @description Get all property of single user
// @access Private - admin access
router.get('/user/property/:userID', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }

        let userPropertyInfo = await UserProperty.find({
            user: req.params.userID
        })
    
        res.status(200).json({
            data: userPropertyInfo
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'User not found'
            });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/property/sell/user/:propertyID
// @description Get all users of single property
// @access Private - admin access
router.get('/property/user/:propertyID', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'property')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }

        let propertyUserInfo = await UserProperty.find({
            property: req.params.propertyID
        }).select('_id').populate('user', ['_id','name', 'avatar', 'email'])
    
        res.status(200).json({
            data: propertyUserInfo
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Property not purchased yet'
            });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router