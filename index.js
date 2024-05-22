
const express = require("express");
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoConnected } = require("./db/db");


const { TokenModel } = require("./model/tokenModel");
 
const app = express();
app.use(express.json());
app.use(cors());
 
const serviceAccount = require("./push-notification-547ad-firebase-adminsdk-aw919-fcecfdbaab.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

 

// Endpoint to receive notification data from frontend


app.get("/tokens", async (req, res) => {
    try {
      const tokens = await TokenModel.find();
  
      res.status(200).json(tokens);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


 
app.post("/token", async (req, res) => {
  const { token } = req.headers;
 

  try {
    const exist = await TokenModel.findOne({token});
   

    if (exist) {
      return res.status(201).json({ token: exist.token });
    }

     
    const newToken = new TokenModel({ token });
   

    await newToken.save();

    res.status(201).json(newToken);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.post("/sendNotification", (req, res) => {
  const { token, title, body, imageUrl } = req.body;
 

  // Construct message payload
  const message = {
    notification: {
      title,
      body,
      image: imageUrl,
    },

    token,
  };

  // Send the message
  admin
    .messaging()
    .send(message)
    .then(() => {

      res.status(200).json({message:"Notification sent successfully"});
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).send("Error sending notification");
    });
});



// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await MongoConnected();
  
  console.log(`Server is running on port ${PORT}`);
});
