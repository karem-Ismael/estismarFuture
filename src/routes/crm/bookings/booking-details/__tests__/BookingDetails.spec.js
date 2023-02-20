import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MockedProvider } from "@apollo/client/testing";
import { GetRentalDetailsQuery } from "gql/queries/Rental.queries.gql";
import { translationMessages } from "../../../../../translations/i18n";
import BookingDetails from "../BookingDetails";

describe("<BookingDetails />", () => {
  const mocks = [
    {
      request: {
        query: GetRentalDetailsQuery,
        variables: {
          id: 1,
        },
      },
      result: {
        data: {
          rentalDetails: {
            id: 1,
          },
        },
      },
    },
  ];

  it("renders without error", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en" messages={translationMessages.en}>
          <Router>
            <BookingDetails />
          </Router>
        </IntlProvider>
      </MockedProvider>,
    );
    expect(screen.queryAllByText(/booking details/i)).toBeTruthy();
    expect(screen.getByText(/customer details/i)).toBeInTheDocument();
    expect(screen.getByText(/car details/i)).toBeInTheDocument();
    expect(screen.getByText(/ally details/i)).toBeInTheDocument();
  });
});
