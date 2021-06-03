const createLandlordFunc = require("./functions/createLandlord");

test("Interts landlord to db ", () => {
  expect(createLandlordFunc("tariqule", "khan", "4167676767")).toBe("Inserted");
});
