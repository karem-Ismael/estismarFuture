/**
 * Language Provider Helper Component
 * Used to Display Localised Strings
 */
import React from "react";
import { FormattedMessage, FormattedDate, injectIntl } from "react-intl";

// Injected message
const InjectMassage = (props) => <FormattedMessage {...props} />;

export default injectIntl(InjectMassage, {
  withRef: false,
});

// FormatDate
export const FormatDate = injectIntl(
  (props) => <FormattedDate {...props} day="numeric" month="long" year="numeric" />,
  { withRef: false },
);
// FormatDateTime
export const FormatDateTime = injectIntl(
  (props) => (
    <FormattedDate
      {...props}
      day="numeric"
      month="long"
      year="numeric"
      hour="numeric"
      minute="numeric"
    />
  ),
  { withRef: false },
);
