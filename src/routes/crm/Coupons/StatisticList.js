/** Bookings List */
import React, { useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import Switch from "@material-ui/core/Switch";
import { useMutation } from "@apollo/client";
import { ActivateBranch } from "gql/mutations/ActivateBranch.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import { BookingData } from "./BookingData";

function StatisticList({ bookingsRes, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [activateBranch] = useMutation(ActivateBranch);
  //   const [coupons, setCouponsStates] = useSetState({
  //     collection: [],
  //     metadata: {},
  //   });
  const [bookingsState, setBookingsState] = useState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = bookingsState;

  useEffect(() => {
    // setCouponsStates({
    //   collection: allcoupons?.coupons?.collection,
    //   metadata: allcoupons?.coupons?.metadata,
    // });
    setBookingsState({
      collection: bookingsRes?.dashboardRentals?.collection,
      metadata: bookingsRes?.dashboardRentals?.metadata,
    });
  }, [bookingsRes]);
  const handleChange = (e, id) => {
    activateBranch({
      variables: {
        isActive: e.target.checked,
        branchId: id,
      },
    })
      .then(() => {
        NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
        refetch();
      })
      .catch((err) => {
        NotificationManager.error(err?.message);
      });
  };

  const actions = ({ id, isActive }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      {userCan("coupons.update") && (
        <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
          <Link to={`coupons/${id}`}>
            <i className=" ti-eye"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("coupons.activation") && (
        <Switch
          checked={isActive}
          color="primary"
          name={id}
          onChange={(e) => handleChange(e, id)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )}
      {userCan("coupons.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`coupons/${id}/edit`}>
            <i className=" ti-pencil-alt"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("coupons.update") && (
        <Tooltip title={formatMessage({ id: "common.Statistics" })} placement="top">
          <Link to={`coupons/${id}/edit`}>
            <i class="fa fa-area-chart" aria-hidden="true"></i>
          </Link>
        </Tooltip>
      )}
    </div>
  );
  return (
    <Typography component="div" style={{ padding: 10 }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={BookingData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "isActive"]}
          />
        </RctCollapsibleCard>
      </div>
      <div className="d-flex justify-content-around">
        {metadata?.currentPage && (
          <>
            <Pagination
              count={Math.ceil(metadata?.totalCount / limit)}
              page={metadata?.currentPage}
              onChange={(e, value) => {
                setPage(value);
                history.replace({ hash: `page=${value}` });
              }}
            />
            <PerPage
              specialPagination={[10, 20, 40, 80, 100]}
              handlePerPageChange={(value) => setLimit(value)}
              perPage={limit}
              setPage={setPage}
            />
          </>
        )}
      </div>
    </Typography>
  );
}

StatisticList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  bookingsRes: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default StatisticList;
