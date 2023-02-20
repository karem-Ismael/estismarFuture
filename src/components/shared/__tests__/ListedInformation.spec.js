import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "util/test-utils";
import ListedInformation from "../ListedInformation";

test("it should render FormattedDate and have a formated pt date", () => {
  render(<ListedInformation data={[{ msgId: "common.confirm", value: 345 }]} />, { locale: "en" });
  expect(screen.getByTestId("data-info-0")).toHaveTextContent("345");
  expect(screen.getByTestId("data-info-0")).toHaveTextContent("Confirm");
});
