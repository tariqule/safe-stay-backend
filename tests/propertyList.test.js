const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "beer",
];

test("returns list of properties", () => {
  expect(shoppingList).toContain("beer");
  expect(new Set(shoppingList)).toContain("beer");
});
