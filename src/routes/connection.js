const express = require("express");
const router = express.Router();
//Passes back meta data saying server is live
router.head('/ping', (req,res) =>{
    res.set('X-Status', 'Server Is Live');
    res.status(200).end();
});

router.options('/options', (req,res) =>{
    res.status(200).send({
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type']
    });
});



module.exports = router