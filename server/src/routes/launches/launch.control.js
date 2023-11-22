const {
  launchModel,
  addNewlaunch,
  isIdExisting,
  abandonLaunch,
} = require("../../models/launches.model");

async function getLaunchData(req, res) {
  return res.status(200).json(await launchModel());
}

async function postLaunchData(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate)
    return res.status(400).json({ error: "缺失必填資訊" });

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "日期格式出錯" });

  await addNewlaunch(launch);
  console.log(launch);
  return res.status(201).json(launch);
}

async function deleteLaunchData(req, res) {
  const ids = Number(req.params.id);

  const isIdThere = await isIdExisting(ids);

  //console.log(`我要id:${isIdThere}`);
  if (!isIdThere) {
    return res.status(404).json({ err: "找不到對應的航班" });
  }

  const abndonId = await abandonLaunch(ids);
  console.log("我要看" + abndonId);

  if (!abndonId) {
    return res.status(400).json({ err: "無法刪除id相對的航班" });
  }

  return res.status(200).json({ ok: true });
}

module.exports = {
  getLaunchData,
  postLaunchData,
  deleteLaunchData,
};
