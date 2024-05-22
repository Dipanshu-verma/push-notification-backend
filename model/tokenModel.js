const mongoose  = require("mongoose");

const tokenSchema =  mongoose.Schema({
    token:{type:String,required:true,unique:true}
})

const TokenModel =  mongoose.model("token",tokenSchema);

module.exports = {TokenModel}