// express is needed to have Router , becoz router is of express
const express = require("express");
const { validateRegisterData } = require("../utils/AuthUtils");
const UserSchema = require("../Schemas/UserSchema");
const User = require("../Models/UserModels");
const bcrypt = require("bcrypt");
const isAuth = require("../Middlewares/AuthMiddleware");
// here creating router
const Authrouter = express.Router();

Authrouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password, name } = req.body;

  // clean the data
  try {
    await validateRegisterData({ name, email, password, username });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data Invalid",
      error: error,
    });
  }

  try {
    await User.userNameAndEmailExist({ email, username });
    const userObj = new User({ name, email, username, password });
    // response return by register method will be saved in userDb variable
    const userDb = await userObj.register();
    res.send({
      status: 200,
      message: "Register success",
      data: userDb,
    });
  } catch (error) {
    //console.log(error);
    res.send({
      status: 200,
      message: "Database error",
      error: error,
    });
  }

  // return res.send("register hit");
});

Authrouter.post("/login", async (req, res) => {
  console.log("login working");

  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credential",
    });
  }

  // find user with loginId

  try {
    const userDb = await User.findUserWithLoginId({ loginId });
    // comparing hashed password db and giving password
    const isMatched = await bcrypt.compare(password, userDb.password);
    if (!isMatched) {
      return res.send({
        staus: 400,
        message: "Password does not matched",
      });
    }

    // here we are modifying the session
    // and saving user object and data inside it  
    // and one isAuth variable
    req.session.isAuth= true;
    req.session.user={
      email:userDb.email,
      username:userDb.username,
      userId: userDb._id,
      
    }

    
    // Set the session ID as a cookie
  //   res.cookie('sessionId', req.session.id, {
  //     maxAge: 24 * 60 * 60 * 1000, // Optional: Cookie expiration time in milliseconds (e.g., 24 hours)
  //     secure: true, // Ensure cookies are only sent over HTTPS
  //     httpOnly: true // Prevent client-side JavaScript access to the cookie
  // });


    return res.send({
      status: 200,
      message: "login success",
      cookie:req.session.id
    });
  } catch (error) {
    res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});


Authrouter.post("/logout", isAuth, (req,res)=>{
req.session.destroy((error)=>{
  if(error)return res.send({
    status:400,
    message:"Logout not successfull",
  });
  return res.send({
    status:200,
    message:"Logout successfull",
  })
})
})

module.exports = Authrouter;
