const cases = require("jest-in-case");
const { strongPasswordRegex } = require("../regex");

describe("Password validation", () => {
  const requiredSepcialChars = "~`!@#$%^&*() _+={}[]|\\;: <>,./?";

  cases(
    "Aa123456 + any special characted will match strong password",
    (char) => {
      expect(`Aa123456${char}`.match(strongPasswordRegex)).toBeTruthy();
      expect(`A123456${char}`.match(strongPasswordRegex)).toBeTruthy();
    },
    requiredSepcialChars.split(""),
  );

  cases(
    "invalid passwords won't match strong password",
    (password) => {
      expect(password.match(strongPasswordRegex)).toBeFalsy();
    },
    ["aaa123456", "123!$asd", "AA123Aaas", "Aa123%", "AAaa1234567890&2"],
  );
});
