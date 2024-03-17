const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/UserModels");
const {
  followUser,
  followerUserList,
  followingUserList,
  unFollowUser,
} = require("../Models/Followmodel");

FollowRouter.post("/follow-user", async (req, res) => {
  // ============data validation ============================>//

  // who is trying to follow other
  // we are getting his id (like robil follow lovely)
  // here robil's id
  const followerUserId = req.session.user.userId;
  // who has been gotten  follow
  // we are getting his id
  // here lovely's id
  const followingUserId = req.body.followingUserId;

  try {
    await User.findUserWithId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "follower User id not found",
    });
  }

  try {
    await User.findUserWithId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "following  User id not found",
    });
  }

  //----------------------------------------//
  try {
    const followDb = await followUser({ followerUserId, followingUserId });
    return res.send({
      status: 200,
      message: "follow successfully",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

  console.log(typeof followerUserId, typeof followingUserId);
  return res.send("follow is working ");
});

FollowRouter.get("/follower-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  console.log(followingUserId)
  const SKIP = Number(req.query.skip) || 0;

  try {
    await User.findUserWithId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "following  User id not found",
    });
  }

  // model return list of follower details

  try {
    const data = await followerUserList({ followingUserId, SKIP });
    return res.send({
      status: 200,
      message: "reading successfully",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.get("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
 // console.log(followerUserId)

  const SKIP = Number(req.query.skip) || 0;

  try {
    await User.findUserWithId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Following user not found",
      error: error,
    });
  }

  try {
    const data = await followingUserList({ followerUserId, SKIP });
    return res.send({
      status: 200,
      message: "reading successfully",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});


FollowRouter.post("/unfollow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.findUserWithId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Follower userid not found",
      error: error,
    });
  }

  try {
    await User.findUserWithId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Follower userid not found",
      error: error,
    });
  }

  try {
    const followDb = await unFollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;
