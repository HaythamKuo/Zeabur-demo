const http = require("http");
const mongoose = require("mongoose");
//express.js
const app = require("./app");
const { loadPlanets } = require("./models/planet.model");
const MONGO_URL = "mongodb://127.0.0.1:27017/NASA";
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
mongoose.connection.once("open", () => console.log("已經連接到DB"));
mongoose.connection.on("error", (err) => console.error(err));

async function startServer() {
  await mongoose.connect(MONGO_URL);

  await loadPlanets();
  server.listen(PORT, () => console.log(`正在聆聽${PORT}`));
}

startServer();
