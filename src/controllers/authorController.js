

const { response } = require("express");
const authorModel= require("../models/authorModel")



const createAuthor= async function (req, res) {
    let author = req.body
    const emailvalidator = require("email-validator");
    if(emailvalidator.validate(req.body.email)){
        let authorCreated = await authorModel.create(author)
        res.send({data: authorCreated})
    }else{
       res.status(400).send('Invalid Email');
    }
    let authorCreated = await authorModel.create(author)
    res.send({ status: true ,data: authorCreated})
}


module.exports.createAuthor=createAuthor
