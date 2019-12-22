var express = require('express');
var router = express.Router();
var config = require('config')

/* GET login page. */
router.get('/forgot', function(req, res, next) {
  const scripts = [
    '/assets/bundles/libscripts.bundle.js',
    '/assets/bundles/vendorscripts.bundle.js',
    '/assets/js/auth/common.js',
  ]
  const styles = [
    '/assets/css/main.css',
    '/assets/css/authentication.css',
    '/assets/css/color_skins.css',
  ]

  res.render('pages/auth/common/forgot', {
    scripts: scripts,
    styles: styles,
    host: config.get('hostname')
  });
});

module.exports = router;