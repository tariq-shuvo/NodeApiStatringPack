const addPartitionRoute = require('./operation/add')
const updatePartitionRoute = require('./operation/update')
const partitionListRoute = require('./operation/home')
const partitionTypeRoute = require('./operation/type')

module.exports={
    addPartitionRoute,
    updatePartitionRoute,
    partitionListRoute,
    partitionTypeRoute
}