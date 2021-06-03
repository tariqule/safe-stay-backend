const loginFunc = require("./functions/login");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxODU0MDQ4NywiZXhwIjoxNjE4NTQxMzg3fQ.-fCi87McdiwgaUucq8HoTy3WFfPqlbVk08T9XMyYBrM";

/**
 * Test 1
 */
test("Returns token if email and password is valid", () => {
  expect(loginFunc("tariqule", "pass")).toBe(token);
});
