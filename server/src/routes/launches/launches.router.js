const express = require("express");
const {
  getLaunchData,
  postLaunchData,
  deleteLaunchData,
} = require("../launches/launch.control");
const launchRouter = express.Router();

launchRouter.get("/", getLaunchData);
launchRouter.post("/", postLaunchData);
launchRouter.delete("/:id", deleteLaunchData);
module.exports = launchRouter;
