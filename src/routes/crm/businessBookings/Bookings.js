/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/** Bookings/Rentals Page */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BusinessRentals } from "gql/queries/BusinessRentals.gql";
import { BusinessRentalsCount } from "gql/queries/RentalsCount.gql";
import { useQuery } from "@apollo/client";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { RctCard, RctCardContent } from "Components/RctCard";
import IntlMessages from "util/IntlMessages";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import { NotificationManager } from "react-notifications";
import { userCan, getPageFromHash } from "functions";
import { BookingFilterStatus, BusinessBookingFilterStatus, substatus } from "constants/constants";
import { AppBar, Grow, Paper, Tabs, Tab, Collapse, Button } from "@material-ui/core";
import { Badge } from "reactstrap";
import { Users } from "gql/queries/CustomerCare.gql";

import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import BookingsList from "./components/BookingsList";

export default function Bookings() {
  const location = useLocation();
  const history = useHistory();
  const [count, setCount] = useState();
  const { formatMessage } = useIntl();
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(20);
  const [orderBy, setOrderBy] = useState();
  const [sortBy, setSortBy] = useState();

  const { data: bookingsRes, refetch, loading, error } = useQuery(BusinessRentals, {
    skip: !userCan("business_rentals.list"),
    variables: { page, limit, orderBy, sortBy, ...query },
  });
  const { data: rentalcount } = useQuery(BusinessRentalsCount);
  const [value, setValue] = React.useState(0);
  const { data: users } = useQuery(Users);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChange = (e, value) => {
    if (substatus.includes(BookingFilterStatus[value])) {
      setValue(value);
      setPage(1);

      history.replace({ search: JSON.stringify({ subStatus: BookingFilterStatus[value] }) });
      setQuery({ subStatus: BookingFilterStatus[value] });
      return;
    }
    if (BookingFilterStatus[value] == "all") {
      history.replace({ search: "" });

      setPage(1);
      setValue(value);

      setQuery({ status: null });
      return;
    }
    history.replace({ search: JSON.stringify({ status: BookingFilterStatus[value] }) });
    setPage(1);
    setValue(value);
    setQuery({ status: BookingFilterStatus[value] == "all" ? null : BookingFilterStatus[value] });
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (error?.message) NotificationManager.error(error.message);
  }, [error]);
  useEffect(() => {
    if (rentalcount) {
      setCount(rentalcount?.businessRentalsCount.all);
    }
  }, [rentalcount]);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.businessBookings" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.businessBookings" />}
        match={location}
        enableBreadCrumb
        extraButtons={<></>}
      />
      {userCan("business_rentals.list") && (
        <>
          <div className="search-bar-wrap">
            <div className="d-flex justify-content-end">
              <Button
                className="d-flex justify-content-end mb-2 align-items-center"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <FilterListIcon />
                <span>
                  <FormattedMessage id="Filter" />
                </span>
                {!isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Button>
            </div>
            <RctCard>
              <RctCardContent>
                <Collapse in={isCollapsed} timeout="auto">
                  <div style={{ marginBottom: "60px" }}>
                    <FiltersAndSearches
                      refetch={refetch}
                      setPage={setPage}
                      query={query}
                      setQuery={setQuery}
                      submitbtnid="search.filter"
                      mobile
                      mobileRef="customerMobile"
                      fields={[
                        { type: "search", name: "customerName" },
                        {
                          type: "search",
                          name: "customerNid",
                          placeholder: formatMessage({ id: "nid.placeholder" }),
                        },
                        {
                          type: "search",
                          name: "bookingNo",
                          placeholder: formatMessage({ id: "bookingNo.placeholder" }),
                        },
                        {
                          type: "search",
                          name: "allyCompanyName",
                          placeholder: formatMessage({ id: "allyname.placeholder" }),
                        },
                        // { type: "search", name: "allyCompanyName", placeholder: formatMessage({ id: "bookingNo.placeholder" }) },
                      ]}
                      filters={["makeId", "pickUpCityId", "businessStatus"]}
                      pickupDateFilter
                      dropoffDateFilter
                    />
                  </div>
                </Collapse>
                <div
                  style={{
                    flexGrow: 1,
                    width: "100%",
                  }}
                >
                  <Paper square>
                    <AppBar position="static" color="default">
                      <Grow in>
                        <Tabs
                          value={value}
                          indicatorColor="primary"
                          textColor="primary"
                          onChange={handleChange}
                          aria-label="disabled tabs example"
                          variant="scrollable"
                          scrollButtons="auto"
                        >
                          {count &&
                            BusinessBookingFilterStatus.map((filterbook) => (
                              <Tab
                                label={<FormattedMessage id={`${filterbook.toUpperCase()}`} />}
                                className={`${
                                  filterbook == "all" ||
                                  filterbook == "confirmed" ||
                                  filterbook == "car_received" ||
                                  filterbook == "invoiced" ||
                                  filterbook == "cancelled" ||
                                  filterbook == "closed"
                                    ? null
                                    : ""
                                }`}
                                icon={
                                  <Badge
                                    color="secondary"
                                    anchorOrigin={{
                                      vertical: "top",
                                      horizontal: "right",
                                    }}
                                  >
                                    {count.find((c) => c[0] == filterbook)
                                      ? count.find((c) => c[0] == filterbook)[1]
                                      : filterbook == "all"
                                      ? ""
                                      : 0}
                                  </Badge>
                                }
                              />
                            ))}
                        </Tabs>
                      </Grow>
                    </AppBar>
                  </Paper>
                </div>
              </RctCardContent>
            </RctCard>
          </div>
          <BookingsList
            refetch={refetch}
            loading={loading}
            setPage={setPage}
            page={page}
            setLimit={setLimit}
            limit={limit}
            bookingsRes={bookingsRes}
            users={users?.users?.collection}
            setOrderBy={setOrderBy}
            setSortBy={setSortBy}
          />
        </>
      )}
    </div>
  );
}
