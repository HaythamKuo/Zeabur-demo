const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/NASA";

mongoose.connection.once("open", () => console.log("已經連接到DB"));
mongoose.connection.on("error", (err) => console.error(err));

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
