const express = require("express")
const { addwork } = require("../controller/works")
const router = express.Router()

router.post("/",addworkwork)

module.exports = router