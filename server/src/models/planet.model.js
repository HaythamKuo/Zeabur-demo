//該套件可以讀取csv, 是用來解析 CSV 檔案的函式

const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");
const planet = require("./planet.mongo");

function loadPlanets() {
  return new Promise((resolve, reject) => {
    const isGoodToPeople = (plant) =>
      plant["koi_disposition"] === "CONFIRMED" &&
      plant["koi_insol"] > 0.36 &&
      plant["koi_insol"] < 1.11 &&
      plant["koi_prad"] < 1.6;
    fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv"))
      /**
       * pipe()是將readable stream與parse()連接起來
       * 另外要客製格式的話就要在parse()內設置
       */
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isGoodToPeople(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        // console.log(err);
        reject(err);
      })
      .on("end", async () => {
        //const names = result.map((plant) => plant["kepler_name"]);
        const planetCount = (await planetsModel()).length;
        resolve();
      });
  });
}

//const planetsModel = () => result;

async function planetsModel() {
  return await planet.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(data) {
  try {
    await planet.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        //可以自動更新的option
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`無法儲存行星 像是${error}`);
  }
}

module.exports = {
  loadPlanets,
  planetsModel,
};
