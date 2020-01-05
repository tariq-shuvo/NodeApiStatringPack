const addProjectRoute = require('./operation/add')
const updateProjectRoute = require('./operation/update')
const projectListRoute = require('./operation/home')
const projectTypeRoute = require('./operation/type')

module.exports={
    addProjectRoute,
    updateProjectRoute,
    projectListRoute,
    projectTypeRoute
}