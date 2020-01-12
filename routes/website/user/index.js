const addAdminRoute = require('./operation/add')
const updateAdminRoute = require('./operation/update')
const roleAdminRoute = require('./operation/role')
const adminListRoute = require('./operation/home')

module.exports={
    addAdminRoute,
    updateAdminRoute,
    roleAdminRoute,
    adminListRoute
}