// Load Config 
const config = require('config')
const multer = require('multer')
const fs = require('fs')

const Admin = require('../../models/admin/Admin')

// Specific admin role checking 
const getAdminRoleChecking = async (adminID, roleType) => {
  try {
    const adminInfo = await Admin.findOne({
        _id: adminID
    }).select('roles').populate('roles', ['name'])

    if(!adminInfo){
      return false
    }
    return adminInfo.roles.filter(value => value.name == roleType).length>0 ? true: false
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

// Function for checking an object is empty or not
const isObjEmpty = (obj) => {
    let key;
    for(key in obj){
        if(obj.hasOwnProperty(key))
        {
            return false
        }
    }
    return true
}

// Generate Six Digit Random Number 
const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

// Generate Next Order ID According to Order Collection 
const generateNextCode = (totalOrdersPlaced) => {
    let nextOrderNumber = config.get('generatedIDFrom')
    
    return totalOrdersPlaced+nextOrderNumber+1
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.get('imageLocation'));
  },
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + generateNextCode(Date.now()) + '.' + filetype);
  }
});

// Upload the photos method
const upload = multer({
  storage: storage
});

//Remove uploaded files if not satisfy the validation
const removeNotvalidateFile = (res, uploadedFileDetails, validationMessage) => {
    fs.unlink(uploadedFileDetails.path, (err) => {
      if (err) {
        console.error(err)
        return
      } else {
        return res.json({
          errors: [{
            msg: validationMessage
          }]
        })
      }
    });
  }

//Remove uploaded files from images folder
const removeUploadedFile = (res, removedPath, successInfo) => {
  fs.unlink(removedPath, (err) => {
    if (err) {
      console.error(err)
      return
    } else {
      return res.status(200).json({
        type: 'success',
        msg: successInfo.msg,
        data: successInfo.data
      })
    }
  });
}  

module.exports = {
    isObjEmpty,
    generateRandomNumber,
    generateNextCode,
    upload,
    removeNotvalidateFile,
    removeUploadedFile,
    getAdminRoleChecking
}