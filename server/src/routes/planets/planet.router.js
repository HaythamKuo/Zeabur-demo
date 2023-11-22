const express = require("express");
const { getAllPlanets } = require("./planet.control");
const planetRouter = express.Router();

planetRouter.get("/", getAllPlanets);

module.exports = planetRouter;
