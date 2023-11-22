const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launch", () => {
    /**
     * test定義一個單獨測試案例
     * cakfn編寫測試邏輯
     */
    test("應該回傳200 status code", async () => {
      const res = await request(app)
        .get("/v1/launch")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  describe("Test POST /launch", () => {
    const launchData = {
      mission: "測試啦幹",
      rocket: "Taiwan🇹🇼",
      target: "China",
      launchDate: "April 5, 2028",
    };
    const launchWithoutData = {
      mission: "測試啦幹",
      rocket: "Taiwan🇹🇼",
      target: "China",
    };

    const errDateLaunchData = {
      mission: "測試啦幹",
      rocket: "Taiwan🇹🇼",
      target: "China",
      launchDate: "root",
    };

    //它用於檢查一個物件是否與另一個物件具有相同的結構。換句話說，它用於確保兩個物件具有相同的屬性和值，但不必完全相等。
    test("應該回傳201 status code", async () => {
      const res = await request(app)
        .post("/v1/launch")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const reqDate = new Date(launchData.launchDate).valueOf();
      const resDate = new Date(res.body.launchDate).valueOf();
      expect(resDate).toBe(reqDate);

      expect(res.body).toMatchObject(launchWithoutData);
    });

    //測試錯誤訊息
    test("缺少重要屬性", async () => {
      const res = await request(app)
        .post("/v1/launch")
        .send(launchWithoutData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({ error: "缺失必填資訊" });
    });

    test("日期不正確", async () => {
      const res = await request(app)
        .post("/v1/launch")
        .send(errDateLaunchData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({ error: "日期格式出錯" });
    });
  });
});
