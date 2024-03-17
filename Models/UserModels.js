const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectId;

let User = class {
  username;
  name;
  email;
  password;
  constructor({ email, username, password, name }) {
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
  }

  register() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        Number(process.env.SALT) // here in hash(password, hashit 10times)
      );

      // creating object of userSchema
      const userObj = new UserSchema({
        name: this.name,
        email: this.email,
        password: hashedPassword,
        username: this.username,
      });

      try {
        const userDb = await userObj.save();
        console.log(userDb);
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  // making a static function
  // function to validate email and username

  static userNameAndEmailExist({ email, username }) {
    // making a promise becoz it is accessing database
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await UserSchema.findOne({
          $or: [{ email: email }, { username: username }],
        });

        if (userExist && userExist.email === email) {
          reject("email Already exist");
        }

        if (userExist && userExist.username === username) {
          reject("username is already exist");
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithLoginId({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });
        if (!userDb)
          reject("User does not found in db , Go and register first");
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithId({ userId }) {
    return new Promise(async (resolve, reject) => {
      // validation of typeof objectId

      if (!objectId.isValid(userId)) reject("Type of userId is not valid");

      // now checking that id in database
      try {
        const userDb = await UserSchema.findOne({ _id: userId });
        if (!userDb) reject("Id doesn't exist ");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
