const mongoose = require("mongoose")

const connectdb=async ()=>{
    try{
        await mongoose.connect(process.env.db_url)
        console.log("Database connected successfully !!!")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {connectdb}