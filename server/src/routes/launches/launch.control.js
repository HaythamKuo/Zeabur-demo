const {
  launchModel,
  addNewlaunch,
  isIdExisting,
  abandonLaunch,
} = require("../../models/launches.model");

async function getLaunchData(req, res) {
  return res.status(200).json(await launchModel());
}

function postLaunchData(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate)
    return res.status(400).json({ error: "缺失必填資訊" });

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "日期格式出錯" });

  addNewlaunch(launch);
  return res.status(201).json(launch);
}

function deleteLaunchData(req, res) {
  const ids = Number(req.params.id);
  console.log("有東西" + ids);
  if (!isIdExisting(ids)) {
    console.log("沒有找到航班");
    return res.status(404).json({ err: "找不到對應的航班" });
  }

  const abndonId = abandonLaunch(ids);
  console.log(abndonId);
  return res.status(200).json(abndonId);
}

module.exports = {
  getLaunchData,
  postLaunchData,
  deleteLaunchData,
};
