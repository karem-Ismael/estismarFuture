import { formatTranslationMessages } from "../i18n";

jest.mock("../ar.json", () => ({
  message1: "عربي",
  message2: "عربي2",
}));

const enTranslationMessages = {
  message1: "English",
  message2: "",
};

describe("formatTranslationMessages", () => {
  it("should build only defaults when DEFAULT_LOCALE", () => {
    const result = formatTranslationMessages("ar", { a: "a" });

    expect(result).toEqual({ a: "a" });
  });

  it("should combine default locale and current locale when not DEFAULT_LOCALE", () => {
    const result = formatTranslationMessages("", enTranslationMessages);

    expect(result).toEqual({
      message1: "English",
      message2: "عربي2",
    });
  });
});
