/**
 *
 * @name statusColor
 * @description returuns on of the bootstrap color names like (primary, secondary, warning, ...etc)
 * @param {string} status
 */

const statusColorEquivalent = {
  new: "#7AB3C5",
  pending: "#9EA6A9",
  confirmed: "#7AB3C5",
  carRecieved: "#FA9C3F",
  cancelled: "#F85959",
  closed: "#F85959",
  dueinvoiced: "#F85959",
  invoiced: "#008080",
  pendingExtension: "#9959CC",
  car_received: "#F85959",
  new_request: "#F85959",
  basket: "#F85959",
  customer_care: "#F85959",
  ally_declined: "#F85959",
  late_delivery: "#F85959",
  due_invoice: "#F85959",
  booking_extended: "#F85959",
  pending_review: "#F85959",
  "": "#FFFFFF",
};

export const statusColor = (status) => statusColorEquivalent[status?.toLocaleLowerCase()];
