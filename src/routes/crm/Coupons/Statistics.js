/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */
/** coupons Page */
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/client";
// page title bar
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "util/IntlMessages";

import { userCan, getPageFromHash } from "functions";
import { GetBookingsQuery } from "gql/queries/Rental.queries.gql";
import { CouponStatistics } from "gql/queries/CouponStatistics.gql";
import StatisticList from "./StatisticList";

export default function Statictics() {
  const history = useHistory();
  const { id } = useParams();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState({});

  //   const { data: coupons, refetch, loading } = useQuery(Coupons, {
  //     variables: {
  //       page,
  //       limit,
  //       ...query,
  //       allyCompanyId: query.allyCompanyIds,
  //       cityId: query.cityId ? query.cityId : undefined,
  //     },
  //   });
  const { data: bookingsRes, refetch, loading, error } = useQuery(GetBookingsQuery, {
    skip: !userCan("rentals.list") && !id,
    variables: { page, limit, couponId: id },
  });
  const { data: couponStatistics } = useQuery(CouponStatistics, {
    skip: !id,
    variables: { couponId: id },
  });

  console.log(couponStatistics?.couponStatistics, "couponStatistics");
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.coupons" })}</title>
      </Helmet>

      <PageTitleBar
        title={<IntlMessages id="sidebar.statistics" />}
        match={location}
        lastElement={id}
        enableBreadCrumb
      />

      <>
        <div className="search-bar-wrap d-flex">
          <div className="col-xs-12 col-sm-6 col-md-3 col-xl-3 w-xs-half-block">
            <div className="card pt-30 text-center">
              <div className="media-left mr-25">{formatMessage({ id: "No.of.total.usages" })}</div>
              <div className="media-left mr-25">
                {couponStatistics?.couponStatistics?.noOfUsage
                  ? couponStatistics?.couponStatistics?.noOfUsage
                  : 0}
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-xl-3 w-xs-half-block">
            <div className="card pt-30 text-center">
              <div className="media-left mr-25">{formatMessage({ id: "No.of.users" })}</div>
              <div className="media-left mr-25">
                {couponStatistics?.couponStatistics?.noOfUsers
                  ? couponStatistics?.couponStatistics?.noOfUsers
                  : 0}
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-xl-3 w-xs-half-block">
            <div className="card pt-30 text-center">
              <div className="media-left mr-25">{formatMessage({ id: "Coupon.sales" })}</div>
              <div className="media-left mr-25">
                {couponStatistics?.couponStatistics?.couponSales
                  ? couponStatistics?.couponStatistics?.couponSales
                  : 0}
              </div>
            </div>
          </div>
        </div>
      </>
      <StatisticList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        bookingsRes={bookingsRes}
      />
    </div>
  );
}
