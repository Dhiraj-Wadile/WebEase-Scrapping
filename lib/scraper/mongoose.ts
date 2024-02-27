import mongoose from "mongoose";

let isConnected = false;
//variable to check connection status

export const connectToDB = async () => { 

  mongoose.set("strictQuery", true);
  if(!process.env.MONGO_URI) {
   console.log("MONGO_URI not defined");
  }

  if (isConnected) { 
    console.log("db already connected");
    return;
  }

  try {
    await mongoose.connect("mongodb+srv://dmwadile:dmwadile@amazonproducts.ynww3vn.mongodb.net/?retryWrites=true&w=majority&appName=AmazonProducts");
    isConnected = true;
    console.log("MongoDB already connected");

  } catch (error) {
    console.log("error connecting to db");
  }

};