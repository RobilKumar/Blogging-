const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const { LIMIT } = require("../privateConstants");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check if A is already follow B

      // both followerUserId & follwingUserId is at one place
      // findOne({}) passing 2 query to find these at one place
      const followExist = await FollowSchema.findOne({
        followerUserId: followerUserId,
        followingUserId: followingUserId,
      });

      if (followExist) reject("already following  this user");

      // create object of schema to save in data base
      const followObj = new FollowSchema({
        followerUserId: followerUserId,
        followingUserId: followingUserId,
        creationDateTime: Date.now(),
      });
      // save the object in db

      const followDb = await followObj.save();
      console.log(followDb);
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const followerUserList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    // follow schema->match,sort,pagination
    console.log(typeof followingUserId);
    try {
      const followerList = await FollowSchema.aggregate([
        { $match: { followingUserId: followingUserId } },
        {
          $sort: { creationDateTime: -1 },
        },

        // facet for pagination
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);

      const followersUserIdsList = [];
      const userArray = [];

      followerList[0].data.map(async (followObj) => {
        followersUserIdsList.push(followObj.followerUserId);
      });

      const followerUserDetails = await UserSchema.aggregate([
        {
          $match: { _id: { $in: followersUserIdsList } },
        },
      ]);

      resolve(followerUserDetails);

      // <-----------populate data ------------------------>

      //  const follwerList= await FollowSchema.find({followingUserId}).populate("followerUserId");
      //  resolve(follwerList)

      //<------------=------------------------=---------------->
    } catch (error) {
      reject(error);
    }
  });
};

// const followingUserList = ({ followerUserId, SKIP }) => {
//   return new Promise(async (resolve, reject) => {
//     try {
      
//       const followingList = await FollowSchema.aggregate([
//         {
//           $match: { followerUserId: followerUserId }
//         },
       
//         {
//           $sort: { creationDateTime: -1 },
//         },
       
//         {
//           $fecet: {
//             data: [{ $skip: SKIP }, { $limit: LIMIT }],
//           },
         
//         },
        
//       ]);
     

//       const followingUserIdsList = [];
//       followingList[0].data.map((obj) => {
//         followingUserIdsList.push(obj.followingUserId);
//       });
   
//       const followingUserDetails = await UserSchema.aggregate([
//         { $match: { _id: { $in: followingUserIdsList } } },
//       ]);
//       resolve(followingUserDetails.reverse());
//     } catch (error) {
//       reject(error);
//     }
//   });
// };


const followingUserList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followingList = await FollowSchema.aggregate([
        {
          $match: { followerUserId: followerUserId },
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

      const followingUserIdsList = [];
      followingList[0].data.map((obj) => {
        followingUserIdsList.push(obj.followingUserId);
      });

      const followingUserDetails = await UserSchema.aggregate([
        { $match: { _id: { $in: followingUserIdsList } } },
      ]);

      resolve(followingUserDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const unFollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await FollowSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};


module.exports = { followUser, followerUserList, followingUserList,unFollowUser };
