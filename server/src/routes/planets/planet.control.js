const { planetsModel } = require("../../models/planet.model");

// function getAllPlanets(req, res) {
//   return res.status(200).json(planets);
// }
const getAllPlanets = async (req, res) =>
  res.status(200).json(await planetsModel());

module.exports = {
  getAllPlanets,
};
