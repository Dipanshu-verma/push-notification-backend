const express = require("express");
const cors = require("cors");
const { MongoConnected } = require("./db/db");
const { TokenModel } = require("./model/tokenModel");
 
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());
 

app.get("/token", async(req,res)=>{
    try {
        
        const tokens =  await TokenModel.find();
        res.status(200).json(tokens)
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
})


 app.post("/token", async(req,res)=>{

    const {token} =  req.headers;
     
    try {
           
        const exist =  await TokenModel.findOne({token});
        if(exist){
           return res.status(201).json({token:exist.token})
        }

 
        const newToken =  new TokenModel({token})

        await newToken.save();
        
        res.status(201).json(newToken)
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }

 })




app.listen(8000, async () => {
    await MongoConnected();
    console.log(`Server is running at ${8000}`);
});
