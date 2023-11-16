const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const planetRouter = require("./routes/planets/planet.router");
const launchRouter = require("./routes/launches/launches.router");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(planetRouter);
app.use("/launch", launchRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
