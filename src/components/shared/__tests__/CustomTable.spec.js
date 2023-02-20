import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "util/test-utils";
import { bookingTableData } from "routes/crm/bookings/components/BookingTableData";
import CustomTable from "../CustomTable";

const records = [
  {
    id: "69",
    totalBookingPrice: 148,
    totalInsurancePrice: 112,
    pickUpDate: "2020-12-15",
    dropOffDate: "2020-12-18",
    enMakeName: "Buick",
    arMakeName: "Dodge",
    arModelName: "Juke",
    enModelName: "Prius",
    year: "2016",
    enPickUpCityName: "Riyadh",
    arPickUpCityName: "الرياض",
    enDropOffCityName: "Riyadh",
    arDropOffCityName: "الرياض",
    enVersionName: "ESi",
    arVersionName: "L",
    status: "NEW",
  },
  {
    id: "71",
    totalBookingPrice: 92,
    totalInsurancePrice: 272,
    pickUpDate: "2020-12-15",
    dropOffDate: "2020-12-18",
    enMakeName: "Ford",
    arMakeName: "Honda",
    arModelName: "M5",
    enModelName: "Regal",
    year: "2019",
    enPickUpCityName: "Riyadh",
    arPickUpCityName: "الرياض",
    enDropOffCityName: "Riyadh",
    arDropOffCityName: "الرياض",
    enVersionName: "XL",
    arVersionName: "ESi",
    status: "NEW",
  },
];

test("it should render FormattedDate and have a formated pt date", () => {
  render(
    <CustomTable
      tableData={bookingTableData}
      tableRecords={records}
      actions={(id) => <div>Actions {id}</div>}
    />,
    { locale: "en" },
  );
  expect(screen.getByTestId("header-row")).toHaveTextContent("Actions");
  expect(screen.getByTestId("data-tr-0")).toHaveTextContent("Buick - Prius - ESi - 2016");
  // to ensure that the booking table data didn't change.
  // if it changed we should update the following test
  expect(bookingTableData).toMatchSnapshot();
  expect(screen.getByTestId("data-tr-0")).toHaveTextContent(
    /Buick - Prius - ESi - 2016 SAR148 SAR112 SARDecember 15, 2020Riyadh2:00 AMDecember 18, 2020Riyadh2:00 AMNew/i,
  );
});

it("should capitcalize all heads", () => {
  render(<CustomTable tableData={["abc"]} />);
  screen.getByTestId("capitalized-header");
});
