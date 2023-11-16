const launchesDb = require("./launch.mongo");

const launches = new Map();

let lastFlightNum = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["Kygo", "Nasa"],
  upcoming: true,
  success: true,
};

//launches.set(launch.flightNumber, launch);
saveLaunch(launch);
//透過updateOne()更新或是尋找現有的資料
async function saveLaunch(launch) {
  try {
    await launchesDb.updateOne(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (error) {
    console.error("Error saving launch:", error);
    throw error;
  }
}

function isIdExisting(id) {
  return launches.has(id);
}

function addNewlaunch(launch) {
  lastFlightNum++;
  launches.set(
    lastFlightNum,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["Kygo", "NASA"],
      flightNumber: lastFlightNum,
    })
  );
}

//isId existing?
const launchModel = async () => await launchesDb.find({}, { _id: 0, __v: 0 });

//abndonData
function abandonLaunch(id) {
  const abndonId = launches.get(id);

  abndonId.upcoming = false;
  abndonId.success = false;
  return abndonId;
}

module.exports = {
  isIdExisting,
  launchModel,
  addNewlaunch,
  abandonLaunch,
};
