const getType = (requestLink) => {
    return new Promise((resolve)=>{
        axios({
            method: 'get',
            url: requestLink,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }).then((response) => {
            resolve({
                auth: true,
                response:  response.data
            })
        }).catch((error) => {
            resolve({
                auth: false,
                response:  error.response.data.errors
            })
        });
    })
}

const deleteType = (requestLink, typeID, token) => {
    return new Promise((resolve)=>{
        axios({
            method: 'delete',
            url: requestLink+typeID,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            json: true
        }).then((response) => {
            resolve({
                auth: true,
                response:  response.data
            })
        }).catch((error) => {
            resolve({
                auth: false,
                response:  error.response.data.errors
            })
        });
    })
}

const addNewType = (requestLink, typeInfo, token) => {
    return new Promise((resolve)=>{
        axios({
            method: 'post',
            url: requestLink,
            data: typeInfo,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            json: true
        }).then((response) => {
            resolve({
                auth: true,
                response:  response.data
            })
        }).catch((error) => {
            resolve({
                auth: false,
                response:  error.response.data.errors
            })
        });
    })
}

const updateTypeInfo = (requestLink, typeInfo, token) => {
    return new Promise((resolve)=>{
        axios({
            method: 'put',
            url: requestLink,
            data: typeInfo,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            json: true
        }).then((response) => {
            resolve({
                auth: true,
                response:  response.data
            })
        }).catch((error) => {
            resolve({
                auth: false,
                response:  error.response.data.errors
            })
        });
    })
}