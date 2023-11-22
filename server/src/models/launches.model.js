const axios = require("axios");
const launchesDb = require("./launch.mongo");
const planetDB = require("./planet.mongo");
const SPACEX_API = "https://api.spacexdata.com/v4/launches/query";
//const launches = new Map();

const primaryNum = 100;

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler exploration X", //name
  rocket: "Explorer IS1", //rockert.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b",
  customers: ["Kygo", "Nasa"], //payload.customer
  upcoming: true, //same
  success: true, //same
};

async function populateLaunches() {
  const res = await axios.post(SPACEX_API, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customer: 1,
          },
        },
      ],
    },
  });

  if (res.status !== 200) {
    console.log("🥹問題下載發射資料");
    throw new ErrorEvent("發射失敗");
  }

  const launchDocs = res.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    //console.log(launch.flightNumber, launch.mission);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("launch has loaded");
    return;
  } else {
    await populateLaunches();
  }
}

//透過updateOne()更新或是尋找現有的資料
async function saveLaunch(launch) {
  try {
    await launchesDb.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (error) {
    console.error("Error saving launch:", error);
  }
}

//launches.set(launch.flightNumber, launch);

async function findLastestFlight() {
  const lastestNum = await launchesDb.findOne().sort("-flightNumber");

  if (!lastestNum) {
    return primaryNum;
  }
  return lastestNum.flightNumber;
}

async function findLaunch(filter) {
  return await launchesDb.findOne(filter);
}

async function isIdExisting(id) {
  // return launches.has(id);
  return await findLaunch({
    flightNumber: id,
  });
}

async function addNewlaunch(launch) {
  const planet = await planetDB.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("找不到指定的target");
  }

  const newFlightNum = (await findLastestFlight()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Kygo", "NASA"],
    flightNumber: newFlightNum,
  });
  await saveLaunch(newLaunch);
}

// function addNewlaunch(launch) {
//   lastFlightNum++;
//   launches.set(
//     lastFlightNum,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["Kygo", "NASA"],
//       flightNumber: lastFlightNum,
//     })
//   );
// }

//isId existing?

//回傳無多餘格式的資料
const launchModel = async () => await launchesDb.find({}, { _id: 0, __v: 0 });

//abndonData
async function abandonLaunch(id) {
  const aborted = await launchesDb.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  isIdExisting,
  launchModel,
  addNewlaunch,
  abandonLaunch,
  loadLaunchData,
};
