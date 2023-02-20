/* eslint-disable global-require */

if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/ar"); // Add locale data for de
}

if (!Intl.DisplayNames) {
  require("@formatjs/intl-displaynames/polyfill");
  require("@formatjs/intl-displaynames/dist/locale-data/ar"); // Add locale data for de
}

const enTranslationMessages = require("./en.json");
const arTranslationMessages = require("./ar.json");

export const DEFAULT_LOCALE = "ar";

export const appLocales = ["en", "ar"];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, arTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

export const translationMessages = {
  en: formatTranslationMessages("en", enTranslationMessages),
  ar: formatTranslationMessages("ar", arTranslationMessages),
};
