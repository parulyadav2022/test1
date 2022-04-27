const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({ 

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,         
        ref: 'project1_author' 
    },
    tags: [String], 
    category: {
        type: String,
        required: true
    },
    subcategory: [String],
    
    isDeleted: {
        type: Boolean,
        default: false
    },
   
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)
