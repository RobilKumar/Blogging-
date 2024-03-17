const express= require('express')
const clc= require('cli-color');
const { clearScreenDown } = require('readline');
require('dotenv').config();
const session= require('express-session');
const monogoDbSession= require('connect-mongodb-session')(session);
const cors = require('cors');

//file-imports
require("./db");
const Authrouter= require('./Controllers/AuthController')
const BlogRouter=require('./Controllers/BlogController');
const isAuth = require('./Middlewares/AuthMiddleware');
const FollowRouter = require('./Controllers/FollowController');
const cleanUpBin = require("./cron");

// session store instance in db
const store= new monogoDbSession({
    uri:process.env.MONGO_URI,
    collection:"sessions",
})





// const 
const app= express();
const  PORT= process.env.PORT;











//------------No use of home route now-------------------//
// app.get('/',(req,res)=>{
//     return res.send({
//         status:200,
//         message:"Server is up and running",
//     });
// });
//-------------------------------//





// middleware
app.use(express.json()); // to read json 
// Enable CORS for all routes
app.use(cors());

//  setting up a session middleware using Express.js
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:true,
    saveUninitialized:true,
    store:store, // store address
  
}));



//authrouter
// here those req come with auth
// will be redirected to Authrouter controller
app.use('/auth', Authrouter);
app.use('/blog',isAuth,BlogRouter);
app.use("/follow",isAuth,FollowRouter)


app.listen(8000,()=>{
    console.log(clc.yellowBright.underline(`Blogging server is running PORT:${PORT}`))
    cleanUpBin();
})