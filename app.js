const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const routes = require("./Routes/UserRoutes");
const router = require("./Routes/PostRoutes");

const app=express();

mongoose.connect("mongodb://localhost:27017/BlogAPP")
.then(console.log('MongoDB Connected Succussfully...' ))
.catch(error=>
    console.error("Error connecting to MongoDB: ", e)
);


app.use(express.json());
app.use(cors())
app.options("*",cors())
app.use('/uploads', express.static('uploads'));

app.use("/user",routes)
app.use("/post",router)



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})