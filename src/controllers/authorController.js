

const { response } = require("express");
const jwt = require("jsonwebtoken");
const authorModel= require("../models/authorModel")
const validateEmail = require('email-validator');


const createAuthor= async function (req, res) {
 

try { 
  let {...author} = req.body; //getting the data from req.body in a spread operator
  //Below is the validation for the data
  if (Object.keys(author).length == 0) return res.status(400).send({ status: false, msg: "Data is required to add a Author" });

  //Below is the validation for the data for email, password, name
  if(!author.firstname) return res.status(400).send({ status: false, msg: "First Name is required" });
  if(!author.lastname) return res.status(400).send({ status: false, msg: "Last Name is required" });
  if(!author.title) return res.status(400).send({ status: false, msg: "Title is required" });
  if(!author.email) return res.status(400).send({ status: false, msg: "Email is required" });
  if(!author.Password) return res.status(400).send({ status: false, msg: "Password is required" });
  
  let validString = /\d/; //validating the string for numbers

  //checking if the firstName and lastName are valid string
  if(validString.test(author.firstname)) return res.status(400).send({ status: false, msg: "Enter a valid First Name" });
  if(validString.test(author.lastname)) return res.status(400).send({ status: false, msg: "Enter a valid Last Name" });

  let validTitle = ['Mr', 'Mrs', 'Miss']; //validating the title

  //checking if the title is valid
  if(!validTitle.includes(author.title)) return res.status(400).send({ status: false, msg: "Title should be one of Mr, Mrs, Miss" });

  //checking if the email is valid by using email-validator package
  if(!validateEmail.validate(req.body.email)) return res.status(400).send({ status: false, msg: "Enter a valid email" })
  
  //checking if the email is already exist
  let uniqueEmail = await authorModel.findOne({ email: authorModel.email });
  if(uniqueEmail) return res.status(400).send({ status: false, msg: "Email already exist" })

  let showAuthorData = await authorModel.create(author);
  res.status(201).send({ status: true, data: showAuthorData });
} catch(err) {
  res.status(500).send({ status: false, msg: err.message });
}
}






const loginauthor = async function (req, res) {
    let userName = req.body.email;
    let password = req.body.Password;
  
    let author = await authorModel.findOne({ email: userName, Password: password });
    if (!author)
      return res. status(400).send({
        status: false,
        msg: "username or the password is not corerct",
      });
  
        let token = jwt.sign(
      {
        authorId: author._id.toString(),
        publication: "The rising star",
        work: "Blogcreator",
      },
      "Blog-creator"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
  };
  


 
  
module.exports.createAuthor=createAuthor
module.exports.loginauthor=loginauthor
 