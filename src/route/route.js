const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const auth= require("../middleware/auth")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/author", authorController.createAuthor  )

router.post("/blog",auth.authentication,auth.authorization,blogController.createBlog)
router.get("/blog",auth.authentication,blogController.GetData)

router.put("/updateblog/:blogId",auth.authentication,auth.authorization,blogController.updateblog)
router.delete("/deleteBlogById/:blogId",auth.authentication,auth.authorization,blogController.deleteBlogById)
router.delete("/deleteBlogs", blogController.deleteBlogs)
router.post("/loginauthor", authorController.loginauthor)


module.exports = router;