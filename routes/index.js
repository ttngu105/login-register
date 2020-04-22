const express = require('express');
const router = express.Router();

router.get("/",(request,response)=> response.render("login-register"));
module.exports = router;