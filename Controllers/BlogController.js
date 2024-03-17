const express = require("express");


// file-imports
const { blogDatValidate } = require("../utils/BlogUtils");
const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  updateBlog,
  deleteBlog,
} = require("../Models/BlogModel");
const User = require("../Models/UserModels");
const isAuth = require("../Middlewares/AuthMiddleware");
const { followingUserList } = require("../Models/Followmodel");
const BlogRouter = express.Router();

BlogRouter.post("/create-blog", isAuth, async (req, res) => {
  const userId = req.session.user.userId;
  const { title, textBody } = req.body;
  const creationDateTime = new Date();
  // data validation
  try {
    await blogDatValidate({ title, textBody });

    const user = await User.findUserWithId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data error",
      error: error,
    });
  }

  // create blog in db
  try {
    const blogDb = await createBlog({
      title,
      textBody,
      userId,
      creationDateTime,
    });
    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

  return res.send("blog api is working");
});
//     /get-blogs?skip=2
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const followerUserId = req.session.user.userId;

  // call a function to call a blog

  try {
    const followingUserData = await followingUserList({ followerUserId, SKIP });

    let followingUserIds = [];
    followingUserData.map((obj) => {
      followingUserIds.push(obj._id);
    });


    const blogDb = await getAllBlogs({followingUserIds, SKIP });
    return res.send({
      status: 200,
      message: "Read success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

  return res.send(blogDb);
});

// get /my-blogs?skip=2

BlogRouter.get("/my-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const userId = req.session.user.userId;
  // console.log(SKIP,userId);

  try {
    const myBlogDb = await getMyBlogs({ SKIP, userId });

    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// api to edit-blog
BlogRouter.post("/edit-blog", async (req, res) => {
  const { title, textBody } = req.body.data;
  const userId = req.session.user.userId;
  const blogId = req.body.blogId;

  // data validation
  try {
    await blogDatValidate({ title, textBody });

    //  Verify find userwith id
    await User.findUserWithId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data error ",
      error: error,
    });
  }
  // find the blog with blogId
  try {
    const blogDb = await getBlogWithId({ blogId });

    //    --------------------------------------------//
    //   if(!textBody)
    //   textBody=blogDb.textBody

    //   if(!title)
    //   title=blogDb.title;

    //    --------------------------------------------//
    // check ownership
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 401,
        message: "Not allow to edit , authorisation failed",
      });
    }

    // check the time is less than 30min
    const diff =
      (Date.now() - new Date(blogDb.creationDateTime).getTime()) / (1000 * 60);
    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit after 30 mins of creation",
      });
    }

    // update the title and textBody
    const blogPrev = await updateBlog({ blogId, title, textBody });
    return res.send({
      status: 200,
      message: "Blog edited successfully",
      data: blogPrev,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

BlogRouter.post("/delete-blog", async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });
    

    if(!userId.equals(blogDb.userId)){
        return res.send({
            status:401,
            message:"Not allow to delete it, Authorisation failed"
        })
    }

    const blogPrev= await deleteBlog({blogId});


    console.log(blogPrev);
   return  res.send({
    status:200,
    message:"Deleted successfully",
   });
  } catch (error) {
    res.send({
        status:500,
        message:"Database error",
        error:error,

    })
  }
});

module.exports = BlogRouter;
