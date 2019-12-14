const admin = require('./admin')
const auth = require('./auth')
const verify = require('./common/verify')
const forgot = require('./common/forgot')
const reset = require('./common/reset')

module.exports={
    admin,
    auth,
    verify,
    forgot,
    reset
}