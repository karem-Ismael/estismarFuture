/* eslint-disable prettier/prettier */
export const persist = {
  initLimit: 10,
  unlimitedLimit: 100,
  higherUnlimited: 500,
  megeLimit: 1000,
  customerPhoneLength: 12,
  customerMinPhoneLength: 12,
};

export const Alert = (text) => `🐞 ${text}`;

export const dataTypes = {
  TEXT: "TEXT",
  DATE: "DATE",
  DATETIME: "DATETIME",
  TIME: "TIME",
  NUMBER: "NUMBER",
  PRICE: "PRICE",
  FUNC: "FUNC",
  BILINGUAL: "BILINGUAL", // TEXT ALSO
  TRANSLATE: "TRANSLATE", // ID that exists in locale files
  ACTIONS: "ACTIONS",
  ASSIGNBOOKING: "ASSIGNBOOKING",
  REFUNDBOOKING: "REFUNDBOOKING",
};
export const generateArrayOfYears = () => {
  const max = new Date().getFullYear() + 2;
  const min = max - 50;
  const years = [];

  for (let i = max; i >= min; i -= 1) {
    years.push(i);
  }
  return years;
};
export const rentalMonths = [
  { label: "two.month.rent", value: "2" },
  { label: "three.month.rent", value: "3" },
  { label: "four.month.rent", value: "4" },
  { label: "five.month.rent", value: "5" },
  { label: "six.month.rent", value: "6" },
  { label: "seven.month.rent", value: "7" },
  { label: "eight.month.rent", value: "8" },
  { label: "nine.month.rent", value: "9" },
  { label: "ten.month.rent", value: "10" },
  { label: "eleven.month.rent", value: "11" },
  { label: "twelve.month.rent", value: "12" },
  { label: "twentyfour.month.rent", value: "24" },
];
export const MonthsOfRent = [
  { label: "one.month", value: "1" },
  { label: "two.month", value: "2" },
  { label: "three.month", value: "3" },
  { label: "four.month", value: "4" },
  { label: "five.month", value: "5" },
  { label: "six.month", value: "6" },
  { label: "seven.month", value: "7" },
  { label: "eight.month", value: "8" },
  { label: "nine.month", value: "9" },
  { label: "ten.month", value: "10" },
  { label: "eleven.month", value: "11" },
  { label: "twelve.month", value: "12" },
  { label: "twentyfour.month", value: "24" },
];
export const emptyCustomerDetails = [
  { msgId: "rental.nameFirstNameLastName", value: "" },
  { msgId: "rental.mobileNumber", value: "" },
  { msgId: "rental.nationalIdIqama", value: "" },
  { msgId: "rental.gender", value: "" },
  { msgId: "rental.passportNumber", value: "" },
  { msgId: "rental.dateOfBirth", value: "" },
  { msgId: "rental.age", value: "" },
  { msgId: "rental.driverSLicenseIfFound", value: "" },
  { msgId: "rental.driverSLicenseStatus", value: "" },
];

export const status = ["closed", "cancelled", "pending", "confirmed", "car_received", "invoiced"];
export const substatus = [
  "new_request",
  "basket",
  "customer_care",
  "ally_declined",
  "late_delivery",
  "due_invoice",
  "booking_extended",
  "pending_review",
];
export function Gender(formatMessage) {
  return [
    { value: "male", label: formatMessage({ id: "male" }) },
    { value: "female", label: formatMessage({ id: "female" }) },
  ];
}
export const BookingFilterStatus = [
  "all",
  "confirmed",
  "car_received",
  "invoiced",
  "cancelled",
  "closed",
  "pending",
  "new_request",
  "basket",
  "customer_care",
  "ally_declined",
  "late_delivery",
  "due_invoice",
  "booking_extended",
  "pending_review",
];

export function titlesOptions(formatMessage) {
  return [
    { value: "Mr", label: formatMessage({ id: "Mr" }) },
    { value: "Ms", label: formatMessage({ id: "Ms" }) },
  ];
}

export const bookingsTypes = [{ name: "daily" }, { name: "monthly" }, { name: "delivery" }];

export const MUIDataTableOptions = {
  serverSide: true,
  filterType: "textField",
  download: false,
  print: false,
  filter: false,
  search: false,
  sortFilterList: false,
  selectableRowsHeader: false,
  selectableRowsHideCheckboxes: true,
  rowsPerPageOptions: [10, 25, 50, 100],
};
export const colors = [
  "beige",
  "black",
  "white",
  "Gold",
  "Silver",
  "Blue",
  "Green",
  "grey",
  "metallic",
  "red",
  "orange",
  "yellow",
  "Champaign",
];

export const transmissions = [
  { label: "Manual", value: "manual" },
  { label: "Automatic", value: "auto" },
];
export const FeatureType = [
  { label: "Car", value: "car" },
  { label: "Carversion", value: "car_version" },
];
export const availabillityStatus = [
  { label: "active", value: true },
  { label: "inactive", value: "false" },
];
export const CustomerStatus = [
  { label: "blocked", value: "blocked" },
  { label: "partially_blocked", value: "partially_blocked" },
];
export const BannerStatus = (formatMessage) => [
  { label: formatMessage({ id: "active" }), value: true },
  { label: formatMessage({ id: "inactive" }), value: "false" },
];
export const BookingStatus = [
  { label: "Active", value: "true" },
  { label: "inActive", value: "false" },
];

export const BusinessBookingFilterStatus = [
  "all",
  "confirmed",
  "car_received",
  "invoiced",
  "cancelled",
  "closed",
  // "pending",
  // "new_request",
  // "basket",
  // "customer_care",
  // "ally_declined",
  // "late_delivery",
  // "due_invoice",
  // "booking_extended",
  // "pending_review",
];

export const allyClassOptions = (formatMessage) => [
  { label: formatMessage({ id: "A" }), value: "A" },
  { label: formatMessage({ id: "B" }), value: "B" },
  { label: formatMessage({ id: "C" }), value: "C" },
  { label: formatMessage({ id: "D" }), value: "D" },
];
export const paytype = (formatMessage) => [
  { label: formatMessage({ id: "free" }), value: "free" },
  { label: formatMessage({ id: "one.time" }), value: "one_time" },
  { label: formatMessage({ id: "daily" }), value: "daily" },
];
export const showFor = (formatMessage) => [
  { label: formatMessage({ id: "ally" }), value: "ally_company" },
  { label: formatMessage({ id: "branch" }), value: "branch" },
];
export const PaymentMethod = (formatMessage) => [
  { label: formatMessage({ id: "CASH" }), value: "CASH" },
  { label: formatMessage({ id: "online" }), value: "ONLINE" },
];
export const DeliveryPaymentMethods = (formatMessage) => [
  { label: formatMessage({ id: "CASH" }), value: "cash" },
  { label: formatMessage({ id: "ONLINE" }), value: "online" },
  { label: formatMessage({ id: "ALL" }), value: "all" },
];

export const PaymentMethodWithAll = (formatMessage) => [
  { label: formatMessage({ id: "widgets.all" }), value: "ALL" },

  { label: formatMessage({ id: "CASH" }), value: "CASH" },
  { label: formatMessage({ id: "online" }), value: "ONLINE" },
];
export const PaymentStatusMethod = (formatMessage) => [
  { label: formatMessage({ id: "Not Paid" }), value: "not_paid" },
  { label: formatMessage({ id: "Paid" }), value: "paid" },
  { label: formatMessage({ id: "Refunded" }), value: "refunded" },
];

export const workingDays = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export const carStatus = (formatMessage) => [
  { value: "1", label: formatMessage({ id: "active" }) },
  { value: "0", label: formatMessage({ id: "inactive" }) },
];

export const workingDaysIndeeces = [6, 0, 1, 2, 3, 4, 5];
