var express = require('express');
var router = express.Router();
var config = require('config')

/* GET login page. */
router.get('/update/:id', function(req, res, next) {
  const scripts = [
    '/assets/bundles/libscripts.bundle.js',
    '/assets/bundles/vendorscripts.bundle.js',
    '/assets/bundles/c3.bundle.js',
    '/assets/bundles/jvectormap.bundle.js',
    '/assets/bundles/knob.bundle.js',
    '/assets/bundles/mainscripts.bundle.js',
    '/assets/js/pages/index.js',
  ]
  const styles = [
    '/assets/plugins/bootstrap/css/bootstrap.min.css',
    '/assets/plugins/charts-c3/plugin.css',
    '/assets/plugins/jvectormap/jquery-jvectormap-2.0.3.min.css',
    '/assets/css/main.css',
    '/assets/css/color_skins.css',
  ]

  const breadcumb = {
    main: {
      text: 'admin',
      link: config.get('hostname') + '/dashboard/admin'
    },
    sub: [
      {
        text: 'create',
        link: config.get('hostname') + '/dashboard/admin/create'
      }
    ]
  }

  const data = {
    siteTitle: "Amanahomes - Admin Update",
    pageTitle: "Admin Update",
    adminID: req.params.id
  }

  res.render('pages/admin/update', {
    scripts: scripts,
    styles: styles,
    breadcumb: breadcumb,
    data: data,
    host: config.get('hostname')
  });
});

module.exports = router;