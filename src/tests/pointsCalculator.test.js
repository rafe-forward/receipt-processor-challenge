const { calculatePoints } = require("../utils/pointCalculation");

describe("calculatePoints", () => {
  const sample = {
    retailer: "M&M Market123",
    purchaseDate: "2022-03-21", 
    purchaseTime: "14:30",      
    total: "20.00",
    items: [
      { shortDescription: "Item One", price: "5.00" },
      { shortDescription: "Nice Shirt", price: "15.00" }
    ]
  };

  test("calculates points correctly", () => {
    const points = calculatePoints(sample);
    expect(typeof points).toBe("number");
    expect(points).toBeGreaterThan(0); 
  });
});
