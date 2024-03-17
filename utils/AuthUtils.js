
function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// its a validator for register request and 
//using series of variable doesn't matter because its a javascript object
const validateRegisterData=({name,password, email, username})=>{
    return new Promise((resolve, reject)=>{
        if(!name || !email || !username || !password)
        reject("Missing credentials");

      if(typeof email!=="string") reject("Email is not String")
      if(typeof username!=="string") reject("username is not String")
      if(typeof password!=="string") reject("password is not String")

      if(username.length <3 || username.length>50)
      reject ("Length of username should be 3-50");
    

      if(!isValidEmail(email)){
        reject ("Email format is wrong")
      }


      resolve();

    })


}


module.exports= {validateRegisterData,isValidEmail}