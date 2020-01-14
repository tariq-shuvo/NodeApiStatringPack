const express = require('express');
const router = express.Router();

const auth = require('../../../../middleware/admin/auth');
const IncomeType = require('../../../../models/assessment/IncomeType');

const { getAdminRoleChecking } = require('../../../../lib/helpers');

// @route GET api/assessment/income/type
// @description Get Assessment Income Types
// @access Private
router.get('/', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for income type'
                    }
                ]
            })
        }

        let IncomeTypes = await IncomeType.find({})
    
        res.status(200).json({
            data: IncomeTypes
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route GET api/assessment/income/type/:typeID
// @description Get Single Assessment Income Types
// @access Private
router.get('/:typeID', auth, async (req, res) => {
    
    try {
        const adminRoles = await getAdminRoleChecking(req.admin.id, 'assessment')

        if (!adminRoles) {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Account is not authorized for income type'
                    }
                ]
            })
        }

        let IncomeTypes = await IncomeType.findById(req.params.typeID)
    
        res.status(200).json({
            data: IncomeTypes
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid project type'
                    }
                ]
            })
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router