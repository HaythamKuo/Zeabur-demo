const http = require("http");
require("dotenv").config();

const { mongoConnect } = require("./services/mongo");
//express.js
const app = require("./app");
const { loadPlanets } = require("./models/planet.model");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  await mongoConnect();

  await loadPlanets();
  await loadLaunchData();
  server.listen(PORT, () => console.log(`正在聆聽${PORT}`));
}

startServer();
