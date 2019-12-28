const express = require('express');
const router = express.Router();

const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../../../middleware/admin/auth');
const UserProperty = require('../../../../models/user/UserProperty');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route POST api/property/sell
// @description Add Property Sell
// @access Private - admin access
router.post('/', [auth, 
    [
        check('user', 'User id is required').not().isEmpty(),
        check('property', 'Property id is required').not().isEmpty(),
        check('total_price', 'Property total price is required').not().isEmpty(),
        check('installment_amount', 'Property installment amount required').not().isEmpty(),
        check('installment_number', 'Property number of installment required').not().isEmpty(),
        check('next_installment_date', 'Property next installment date required').not().isEmpty(),
        check('installment_due_day', 'Property next installment number of day required').not().isEmpty(),
        check('installment_due_extension', 'Property installment expiration extesion required').not().isEmpty(),
        check('delivery', 'Property delivery is required').not().isEmpty(),
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
                        msg: 'Account is not authorized for property type'
                    }
                ]
            })
        }


        const {user, property, total_price, installment_amount, installment_number, next_installment_date, installment_due_day, installment_due_extension, delivery} = req.body

        const userPropertyInfo = new UserProperty({
            user, 
            property, 
            "payment.totalCost": total_price, 
            "payment.installment.amount": installment_amount, 
            "payment.installment.number": installment_number, 
            "payment.nextDueDate": next_installment_date, 
            "payment.dueDateDuration": installment_due_day, 
            "payment.dueDateExtension": installment_due_extension,
            delivery
        })

        await userPropertyInfo.save()

        res.status(200).json({
            type: 'success',
            msg: 'Property sold successfully',
            data: userPropertyInfo
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router