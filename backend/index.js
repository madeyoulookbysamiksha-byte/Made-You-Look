const express = require("express");
const cors = require("cors")
require("dotenv").config()
const worksRouter = require("./routes/works");
const { connectdb } = require("./config/database");
const app = express();
app.use(cors())
connectdb();
app.use("api/work",worksRouter)

app.listen(5177,()=>{
    console.log("Server has started");
})