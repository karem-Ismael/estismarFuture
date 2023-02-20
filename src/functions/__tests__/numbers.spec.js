import { easternToEnglishNumbers } from "../numbers";

describe("easternToEnglishNumbers function", () => {
  it("should return the same sting length", () => {
    expect(easternToEnglishNumbers("٠١٢٣٤٥٦٧٨٩")).toHaveLength(10);
  });

  it.each([
    ["٠١٢٣٤٥٦٧٨٩", "0123456789"],
    ["٥٦٧٨٩", "56789"],
    ["56789", "56789"],
  ])("easternToEnglishNumbers(%d) should match englishh equivalent", (input, expected) => {
    expect(easternToEnglishNumbers(input)).toBe(expected);
  });
});
