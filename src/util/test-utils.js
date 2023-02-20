// test-utils.js
import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { render as rtlRender } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { translationMessages } from "../translations/i18n";

function render(ui, { locale = "en", ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <IntlProvider locale={locale} messages={translationMessages[locale]}>
        {children}
      </IntlProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

function renderWithIntl(element, locale = "en") {
  let instance;

  ReactTestUtils.renderIntoDocument(
    <IntlProvider locale={locale} messages={translationMessages[locale]}>
      {React.cloneElement(element, {
        ref: instance,
      })}
    </IntlProvider>,
  );

  return instance;
}
// re-export everything
export * from "@testing-library/react";

// override render method
export { render, renderWithIntl };
