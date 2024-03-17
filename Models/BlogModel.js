const BlogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../privateConstants");
const objectId = require("mongodb").ObjectId;

const createBlog = ({ title, textBody, userId, creationDateTime }) => {
  return new Promise(async (resolve, reject) => {
    console.log(title, textBody, userId, creationDateTime);
    title.trim();
    textBody.trim();

    // creating object to save in db of schema
    const blogObj = new BlogSchema({
      title: title,
      textBody: textBody,
      userId: userId,
      creationDateTime: creationDateTime,
    });

    try {
      // saving in data base
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

//find
//sort // pagination
const getAllBlogs = ({ followingUserIds, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.aggregate([
        {
          $match: {
            userId: { $in: followingUserIds },
            isDeleted: { $ne: true },
          },
        },
        {
          $sort: { creationDateTime: -1 }, //DESC
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      resolve(blogDb[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

// find my-blog

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    // console.log(SKIP,userId);
    // console.log("working myblogs");

    try {
      const myBlogsDb = await BlogSchema.aggregate([
        {
          $match: { userId: userId, isDeleted: { $ne: true } },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);

      resolve(myBlogsDb[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!objectId.isValid(blogId)) reject("Type of blogId is not valid");

      const blogDb = await BlogSchema.findOne({ _id: blogId });

      if (!blogDb) reject(`No blog found with this ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
// to update the blog
const updateBlog = ({ blogId, title, textBody }) => {
  return new Promise(async (resolve, reject) => {
    let newBlogData = {}; // creting new  object
    newBlogData.title = title;

    newBlogData.textBody = textBody;

    try {
      const blogPrev = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        newBlogData
      ); /// here we writing newBlogData insted of key value pair
      // because it already a object

      resolve(blogPrev);
    } catch (error) {
      reject(error);
    }
  });
};

// to delete the blog

const deleteBlog = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const blogPrev= await BlogSchema.findByIdAndDelete({_id:blogId});
      const deleteBlog = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deletionDateTime: newDate() }
      );
      // console.log(blogPrev);
      resolve(deleteBlog);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  updateBlog,
  deleteBlog,
};
