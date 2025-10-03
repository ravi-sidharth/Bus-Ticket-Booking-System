const mongoose = require("mongoose");

const connectToDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDb connected successfully")
  } catch(e) {
    console.log('Error occured while connecting Db',e)
  }
}


module.exports = connectToDB