// firstName
// lastName
// phoneNumber

/**
 *  CREATE Landlord TEst Function
 * @param {*} firstName
 * @param {*} lastName
 * @param {*} phoneNumber
 * @returns
 */
const returnedObject = (firstName, lastName, phoneNumber) => ({
  firstName: firstName,
  lastName: lastName,
  phoneNumber: phoneNumber,
});
function createLandlord(firstName, lastName, phoneNumber) {
  if (firstName && lastName && phoneNumber) {
    return "Inserted";
  } else {
    throw new Error("Invalid email or password");
  }
}
module.exports = createLandlord;
