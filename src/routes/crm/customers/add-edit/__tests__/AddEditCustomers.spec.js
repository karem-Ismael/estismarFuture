import React from "react";
import { render } from "util/test-utils";
import { MockedProvider } from "@apollo/client/testing";
import CreateEditUser from "../AddEditCustomers";

/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/react-in-jsx-scope */

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    push: jest.fn(),
  }),
}));
describe("<CreateEditUser />", () => {
  it.skip("should match snapshot", () => {
    const { asFragment } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CreateEditUser />
      </MockedProvider>,
    );
    expect(asFragment).toMatchSnapshot();
  });
});
