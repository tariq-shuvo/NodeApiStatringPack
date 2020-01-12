const admin = require('./admin')
const getAdminData = require('./get')
const removeAdminData = require('./remove')
const auth = require('./auth')
const verify = require('./common/verify')
const forgot = require('./common/forgot')
const reset = require('./common/reset')

module.exports={
    admin,
    getAdminData,
    removeAdminData,
    auth,
    verify,
    forgot,
    reset
}