const { validateReceipt } = require("../utils/validation");

describe("validateReceipt", () => {
  const validReceipt = {
    retailer: "M&M Corner Market",
    purchaseDate: "2022-01-01",
    purchaseTime: "13:01",
    total: "6.49",
    items: [
      { shortDescription: "Mountain Dew 12PK", price: "6.49" }
    ]
  };

  test("does not throw for valid receipt", () => {
    expect(() => validateReceipt(validReceipt)).not.toThrow();
  });

  test("throws for invalid retailer", () => {
    const bad = { ...validReceipt, retailer: 123 };
    expect(() => validateReceipt(bad)).toThrow("Receipt is invalid");
  });

  test("throws for missing items", () => {
    const bad = { ...validReceipt, items: [] };
    expect(() => validateReceipt(bad)).toThrow("Receipt is invalid");
  });
});
