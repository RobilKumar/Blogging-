const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  textBody: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 500,
  },
  creationDateTime: {
    type: String,
    required: true,
  },
  userId: {
    // fk for userSchema
    type: Schema.Types.ObjectId,
    required: true,
    refer: "user",// it is refer from user 
  },

  isDeleted:{
    type:Boolean,
    required:true,
    default:false,
  },

  deletionDateTime:{
    type:Date,
    required:true,
  }
});

module.exports= mongoose.model("blog", blogSchema);
