/**
 * Bookings List
 */
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import PropTypes from "prop-types";
import { Typography, Tooltip } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import { DeleteRole } from "gql/mutations/DeleteRole.gql";
import { NotificationManager } from "react-notifications";
import swal from "sweetalert";
import { RoleData } from "./RoleData";

function RoleList({ allRoles, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteRole] = useMutation(DeleteRole);
  const [bookingsState, setBookingsState] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = bookingsState;

  useEffect(() => {
    setBookingsState({
      collection: allRoles?.roles?.collection,
      metadata: allRoles?.roles?.metadata,
    });
  }, [allRoles]);
  const handelDeleteRole = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.role" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteRole({
          variables: {
            input: { id: +id },
          },
        })
          .then(() => refetch())
          .then((res) =>
            swal(formatMessage({ id: "roledeletedsuccessfully" }), {
              icon: "success",
            }),
          )
          .catch((error) => {
            NotificationManager.error(`${error?.message}`);
          });
      }
    });
  };
  const actions = ({ id }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`roles/${id}`}>
          <i className=" ti-eye"></i>
        </Link>
      </Tooltip>
      <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
        <Link to={`roles/${id}/edit`}>
          <i className=" ti-pencil-alt"></i>
        </Link>
      </Tooltip>
      <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i
          style={{ cursor: "pointer" }}
          className=" ti-trash"
          onClick={() => handelDeleteRole(id)}
        ></i>
      </Tooltip>
    </div>
  );
  return (
    <Typography component="div" style={{ padding: 10, marginTop: "20px" }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={RoleData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id"]}
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

RoleList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  loading: PropTypes.bool,
  allRoles: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default RoleList;
