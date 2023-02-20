/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/**
 * Bookings List
 */
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import PerPage from "components/shared/PerPage";
import CustomTable from "components/shared/CustomTable";
import { userCan } from "functions/userCan";
import { DeleteCustomer } from "gql/mutations/DeleteCustomer.gql";

import { useMutation } from "@apollo/client";
import swal from "sweetalert";
import { NotificationManager } from "react-notifications";

import { customersTableData } from "./CustomersListTableData";

function CustomersList({ customersRes, loading, setPage, refetch, limit, setLimit }) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [bookingsState, setBookingsState] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = bookingsState;
  const [deleteCustomer] = useMutation(DeleteCustomer);

  useEffect(() => {
    setBookingsState({
      collection: customersRes?.users?.collection,
      metadata: customersRes?.users?.metadata,
    });
  }, [customersRes]);

  const actions = ({ id }) => (
    <>
      {/* Redirects to customers/rental details */}
      {userCan("users.show") && (
        <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
          <Link to={`customers/${id}`}>
            <i className=" ti-eye m-1"></i>
          </Link>
        </Tooltip>
      )}
      {/* Redirects to booking/rental edit */}
      {userCan("users.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`customers/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      {/* {
        !customerProfileWithDeleted?.isDeleted && 
        <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i
          style={{ cursor: "pointer" }}
          className=" ti-trash"
          onClick={() => handelDeleteCustomer(id)}
        ></i>
      </Tooltip>
      } */}
    </>
  );
  const handelDeleteCustomer = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.customer" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteCustomer({
          variables: {
            input: { userId: +id },
          },
        })
          .then(() => refetch())
          .then((res) =>
            swal(formatMessage({ id: "customerdeletedsuccessfully" }), {
              icon: "success",
            }),
          )
          .catch((error) => {
            NotificationManager.error(`${error?.message}`);
          });
      }
    });
  };
  return (
    <Typography component="div" style={{ padding: 10 }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={customersTableData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "allyCompanyId", "userId"]}
          />
        </RctCollapsibleCard>
      </div>
      <div className="d-flex justify-content-around">
        {metadata?.currentPage && (
          <>
            <Pagination
              showFirstButton
              showLastButton
              count={Math.ceil(metadata?.totalCount / limit)}
              page={metadata?.currentPage}
              onChange={(e, value) => {
                setPage(value);
                history.replace({ hash: `page=${value}` });
              }}
            />
            <PerPage
              handlePerPageChange={(value) => {
                setLimit(value);
              }}
              perPage={limit}
              setPage={setPage}
            />
          </>
        )}
      </div>
    </Typography>
  );
}

CustomersList.propTypes = {
  setPage: PropTypes.func,
  loading: PropTypes.bool,
  customersRes: PropTypes.object,
  setLimit: PropTypes.func,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CustomersList;
