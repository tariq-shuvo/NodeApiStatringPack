var express = require('express');
var router = express.Router();
var config = require('config')

/* GET login page. */
router.get('/expend/list', function(req, res, next) {
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
      text: 'assessment',
      link: config.get('hostname') + '/dashboard/assessment/expend'
    },
    sub: [
      {
        text: 'expend',
        link: config.get('hostname') + '/dashboard/assessment/expend/type'
      }
    ]
  }

  const data = {
    siteTitle: "Amanahomes - Expend List",
    pageTitle: "Expend List",
  }

  res.render('pages/assessment/expend', {
    scripts: scripts,
    styles: styles,
    breadcumb: breadcumb,
    data: data,
    host: config.get('hostname')
  });
});

module.exports = router;