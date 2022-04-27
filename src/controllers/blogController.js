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


const GetData= async function(req,res){

    let query=req.query

    console.log("query:",query)
    
    //authorId:query.authorId,category:query.category,tags:query.tags,subcategory:query.subcategory

     let GetRecord= await blogModel.find({$and: [{isDeleted: false ,isPublished: true}, query ]})

     console.log("record:  ",GetRecord.length);

     if(GetRecord.length>0){
      return  res.send({msg: GetRecord })
     }
     else{
        return res.status(404).send("no data found")
     }

}

const updateblog = async function (req, res) {
    try {
     
      let Data = req.body;
      let Id = req.params.blogId 
      console.log(Data)
      let updateblog= await blogModel.findOneAndUpdate( 
        {_id: Id} , {
title: Data.title,
body: Data.body,
        },  
        {returnDocument: 'after'},    
      )
      console.log(updateblog)
      if(!updateblog) {
        res.status(404).send({error: "Document not found"})
   }
   
   res.status(200).send({updates:updateblog})
}
catch(err){
    console.log(err)
res.status(500).send({msg: err.message})}
}

const deleteBlogById = async (req, res)=> {
    try {
     let blogId = req.params.blogId;
      if(!blogId) return res.status(400).send({status:false,msg:"BlogId is required"})
    
      let blog = await blogModel.findById(blogId);
      if (!blog)  return res.status(404).send({ status: false, msg: "No such blog found" });
  
      if (blog.isDeleted==true)  return res.status(404).send({ status: false, msg: " Already deleted blog Or Blog not exists" });
  
      let timeStamps = new Date();
      await blog.findOneAndUpdate({_id:blogId},{$set: {isDeleted:true, deletedAt: timeStamps}},{new:true})
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
