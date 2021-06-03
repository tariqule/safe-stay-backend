const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxODU0MDQ4NywiZXhwIjoxNjE4NTQxMzg3fQ.-fCi87McdiwgaUucq8HoTy3WFfPqlbVk08T9XMyYBrM";
/**
 * TEST FOR EMAIL
 * @param {*} email
 * @param {*} password
 * @returns
 */
function login(email, password) {
  if (email && password) {
    return token;
  } else {
    throw new Error("Invalid email or password");
  }
}
module.exports = login;
