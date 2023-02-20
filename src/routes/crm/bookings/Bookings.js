/** Bookings/Rentals Page */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { GetBookingsQuery } from "gql/queries/Rental.queries.gql";
import { RentalsCount } from "gql/queries/RentalsCount.gql";
import { useQuery } from "@apollo/client";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { RctCard, RctCardContent } from "Components/RctCard";
import IntlMessages from "util/IntlMessages";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import { NotificationManager } from "react-notifications";
import { userCan, getPageFromHash } from "functions";
import { BookingFilterStatus, substatus } from "constants/constants";
import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Grow from "@material-ui/core/Grow";
import { Users } from "gql/queries/CustomerCare.gql";
import { Collapse } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import BookingsList from "./components/BookingsList";
import store from "../../../store";

export default function Bookings() {
  const location = useLocation();
  const history = useHistory();
  const [count, setCount] = useState();
  const { formatMessage, messages } = useIntl();
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(20);
  const { ally_id } = store.getState()?.authUser.user;
  const [orderBy, setOrderBy] = useState();
  const [sortBy, setSortBy] = useState();
  const decodedSearch =
    history?.location?.search && JSON.parse(decodeURI(history?.location?.search?.slice(1)));
  const { data: bookingsRes, refetch, loading, error } = useQuery(GetBookingsQuery, {
    skip: !userCan("rentals.list"),
    variables: {
      page,
      limit,
      orderBy,
      sortBy,
      ...query,
      userId: decodedSearch?.userId,
      userNid: query.userNid?.length ? query.userNid : null,
    },
  });
  const { data: users } = useQuery(Users);
  const { data: rentalcount } = useQuery(RentalsCount, {
    variables: {
      userId: decodedSearch?.userId,
    },
  });
  const [value, setValue] = React.useState(0);
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
      setCount(rentalcount?.rentalsCount.all);
    }
  }, [rentalcount]);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.bookings" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.bookings" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("rentals.create") && !ally_id && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("bookings/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.booking }} />
              </Button>
            )}
          </>
        }
      />
      {userCan("rentals.list") && (
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
                  <div className="mb-4">
                    <FiltersAndSearches
                      refetch={refetch}
                      setValue={setValue}
                      setPage={setPage}
                      query={query}
                      setQuery={setQuery}
                      submitbtnid="search.filter"
                      fields={[
                        { type: "search", name: "customerName" },
                        { type: "search", name: "userNid" },
                        { type: "search", name: "bookingNo" },
                        { type: "search", name: "allyName" },
                      ]}
                      filters={[
                        "makes",
                        "cities",
                        "status",
                        "substatus",
                        "payment",
                        "paymentStatusFilter",
                      ]}
                      pickupDateFilter
                      dropoffDateFilter
                      mobile
                      mobileRef="customerMobile"
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
                            BookingFilterStatus.map((filterbook) => (
                              <Tab
                                label={<FormattedMessage id={`${filterbook.toUpperCase()}`} />}
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
            decodedUserId={decodedSearch?.userId}
          />
        </>
      )}
    </div>
  );
}
