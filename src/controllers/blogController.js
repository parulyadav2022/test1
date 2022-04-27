const blogModel= require("../models/blogModel")
const authorModel= require("../models/authorModel")

const createBlog= async function (req, res) {
    try{

    let details= req.body
    let author_Id= details.authorId

    if(!author_Id) {
         res.status(403).send({message: "Author not present"})
    }
    let blogDetails= await blogModel.create(details)
    res.status(201).send({msg: blogDetails})
}
catch(err)
{res.status(500).send({msg: err.message})}
}

module.exports.createBlog=createBlog




/*const createBlog= async function (req, res) {
    let blog = req.body
    let authorId=blog.authorId
    let author= await authorModel.findById(authorId)
    if(!author) {
        return res.status(400).send({status: false, message: "user doesnt exist"})
    }
    let blogCreated = await blogModel.create(blog)
    res.status(201).send({ status: true,data: blogCreated})
}
module.exports.createBlog=createBlog */