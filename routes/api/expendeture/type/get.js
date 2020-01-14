const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const ExpendType = require('../../../../models/assessment/ExpendType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route GET api/assessment/expend/type
// @description Get Assessment Expendeture
// @access Private
router.get('/', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for expendeture type'
                    }
                ]
            })
        }

        let ExpendetureTypes = await ExpendType.find({})
    
        res.status(200).json({
            data: ExpendetureTypes
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/assessment/expend/type/:typeID
// @description Get Single Assessment Expendeture
// @access Private
router.get('/:typeID', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for expendeture type'
                    }
                ]
            })
        }

        let ExpendetureTypes = await ExpendType.findById(req.params.typeID)
    
        res.status(200).json({
            data: ExpendetureTypes
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid expendeture type'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router