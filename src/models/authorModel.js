const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {

    firstname:{
        type: String,
        required:true
    },
  lastname:{
      type:String,
      required:true
  },
  title:{
      type:String,
      enum:["Mr","Mrs","Miss"]
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  Password:{
      type:String,
      required:true
  }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)