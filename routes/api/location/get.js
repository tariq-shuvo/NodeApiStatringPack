const express = require('express');
const router = express.Router();

const request = require('request');

// @route GET api/location
// @description Get user location info
// @access Public
router.get('/', async (req, res) => {
    const userIP = req.connection.remoteAddress
    // const userIP = "103.121.60.102"

    try {
        const options = {
            uri: 'http://www.geoplugin.net/json.gp?ip='+userIP,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error)

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: 'Sorry your ip not detected'
                })
            }
            
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router