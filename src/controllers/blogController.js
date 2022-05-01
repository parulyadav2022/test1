
const mongoose = require('mongoose')
const blogModel= require("../models/blogModel")
const authorModel= require("../models/authorModel")

//Below function is to check whether the given string is a valid ObjectId or not
const isValidObjectId = (ObjectId) => {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

let validString = /\d/;//validating the string for numbers

const createBlog = async (req, res) => {
  try {
    let {...data} = req.body; //destructuring the data from the request body

    //validating the data for empty values
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to create a Blog" });

    //checking that the below data is present or not
    if(!data.title) return res.status(400).send({ status: false, msg: "Title of book is required" });
    if(!data.body) return res.status(400).send({ status: false, msg: "Description of book is required" });
    if(!data.authorId) return res.status(400).send({ status: false, msg: "Author ID is required" });
    if(!data.category) return res.status(400).send({ status: false, msg: "Category of book is required" });
    
    //validating the data for numbers in the body
    if(validString.test(data.body) || validString.test(data.tags) || validString.test(data.category) || validString.test(data.subcategory)) return res.status(400).send({ status: false, msg: "Data must not contains numbers"});

    //validating if the author's ObjectId is valid or not
    if(!isValidObjectId(data.authorId)) return res.status(404).send({ status: false, msg: "Enter a valid author Id" });
    let getAuthorData = await authorModel.findById(data.authorId);
    if(!getAuthorData) return res.status(404).send({ status: false, msg: "No such author exist" });

    let showBlogData = await blogModel.create(data);
    res.status(201).send({ status: true, data: showBlogData });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


const GetData= async function(req,res){

    let query=req.query
    
    //authorId:query.authorId,category:query.category,tags:query.tags,subcategory:query.subcategory

     let GetRecord= await blogModel.find({$and: [{isDeleted: false ,isPublished: true}, query ]})


     if(GetRecord.length>0){
      return  res.send({msg: GetRecord })
     }
     else{
        return res.status(404).send("no data found")
     }

}

const updateblog = async function (req, res) {
  
    try{
      let getBlogId = req.params.blogId;
      if(!getBlogId) return res.status(400).send({ status: false, msg: "Please enter a Blog Id" });
  
      let findBlogId = await blogModel.findById(getBlogId);
      if(!findBlogId) return res.status(404).send({ status: false, msg: "No such blog exist" });
  
      let {...data} = req.body;
      if(Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to update a Blog" });
  
  
  
      let blogUpdate;
      if(data.hasOwnProperty('isDeleted')) return res.status(403).send({ status: false, msg: "Action is Forbidden" });
      if(data.hasOwnProperty('title')){
        blogUpdate = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {title: data.title},
          {new: true}
        )
      }
      if(data.hasOwnProperty('body')){
        blogUpdate = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {body: data.body},
          {new: true}
        )
      }
      if(data.hasOwnProperty('tags')){
        blogUpdate = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {$push: {tags: {$each: data.tags}}},
          {new: true}
        )
      }
      if(data.hasOwnProperty('category')){
        blogUpdate = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {$push: {category: {$each: data.category}}},
          {new: true}
        )
      }
      if(data.hasOwnProperty('subcategory')){
        blogUpdate = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {$push: {subcategory: {$each: data.subcategory}}},
          {new: true}
        )
      }
      if(data.hasOwnProperty('isPublished')){
        blogUpdate = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {isPublished: data.isPublished},
          {new: true}
        )
      }
      if(blogUpdate.isPublished == true){
        let timeStamps = new Date();
        let updateData = await blogModel.findOneAndUpdate(
          {_id: getBlogId},
          {publishedAt: timeStamps},
          {new: true}
        );
        return res.status(200).send({ status: true, data: updateData });
      } 
  
      res.status(200).send({ status: true, data: blogUpdate });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }

const deleteBlogById = async (req, res)=> {
    try {
     let blogId = req.params.blogId;
      if(!blogId) return res.status(400).send({status:false,msg:"BlogId is required"})
    
      let blog = await blogModel.findById(blogId);
      if (!blog)  return res.status(404).send({ status: false, msg: "No such blog found" });
  
      if (blog.isDeleted==true)  return res.status(200).send({ status: false, msg: " Already deleted blog Or Blog not exists" });
  
      let timeStamps = new Date();
      await blogModel.findOneAndUpdate({_id:blogId},{$set: {isDeleted:true, deletedAt: timeStamps}},{new:true})
      res.status(200).send({status:true,msg:"Blog is deleted successfully"})
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }
     
  const deleteBlogs = async (req, res) =>{
    try{
      let {...data} = req.query;
      if(Object.keys(data).length == 0) return res.send({ status: false, msg: "Error!, Details are needed to delete a blog" });
  
      let timeStamps = new Date();
  
      let deletedBlog = await blogModel.updateMany( 
        {$and: [ {isDeleted: false, isPublished: true}, {$or: [ {authorId: data.authorId}, {category: {$in: [data.category]}}, {tags: {$in: [data.tags]}}, {subcategory: {$in: [data.subcategory]}} ] } ]},
        {$set: {isDeleted: true, deletedAt: timeStamps}},
        {new: true}, 
      )
      if(deletedBlog.modifiedCount == 0) return res.status(400).send({ status: false, msg: "No such blog exist or might have already been deleted" })
  
      res.status(200).send({ status: true, msg: "The blog has been deleted successfully" });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }
            
            
       
module.exports.createBlog=createBlog

module.exports.GetData=GetData
module.exports.updateblog=updateblog
module.exports.deleteBlogById=deleteBlogById
module.exports.deleteBlogs=deleteBlogs
