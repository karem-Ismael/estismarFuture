/** Users List */
import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { CircularProgress, Tooltip } from "@material-ui/core";
import useSetState from "hooks/useSetState";
import { MUIDataTableOptions } from "constants/constants";
import { Pagination } from "@material-ui/lab";
import PerPage from "components/shared/PerPage";
import { userCan } from "functions/userCan";
import swal from "sweetalert";
import { NotificationManager } from "react-notifications";
import { DeleteUser } from "gql/mutations/DeleteUser.gql";
import { useMutation } from "@apollo/client";

const sortableColumns = ["name"];
const tableColumns = ["name", "email.address", "status", "roles", "common.actions"];
function UsersList({ usersRes, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage: f, locale } = useIntl();
  const [bookingsState, setBookingsState] = useSetState({
    collection: [],
    metadata: {},
  });

  const [deleteUser] = useMutation(DeleteUser);

  // Columns Headers
  const columns = tableColumns.map((x) => ({
    name: <div style={{ textTransform: "capitalize" }}>{f({ id: x })}</div>,
    options: {
      sort: sortableColumns.includes(x),
    },
  }));
  const handelDeleteUser = (id) => {
    swal({
      title: f({ id: "are.u.sure.?" }),
      text: f({ id: "u.want.delete.user" }),
      icon: "warning",
      buttons: [f({ id: "cancel" }), f({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteUser({
          variables: {
            input: { id: +id },
          },
        })
          .then(() => refetch())
          .then((res) =>
            swal(f({ id: "userdeletedsuccessfully" }), {
              icon: "success",
            }),
          )
          .catch((error) => {
            NotificationManager.error(`${error?.message}`);
          });
      }
    });
  };
  // Actions
  const actions = ({ id }) => (
    <>
      {userCan("users.show") && (
        <Tooltip title={f({ id: "common.details" })} placement="top">
          <Link to={`users/${id}`}>
            <i className=" ti-eye m-1"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("users.update") && (
        <Tooltip title={f({ id: "common.edit" })} placement="top">
          <Link to={`users/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("users.delete") && (
        <Tooltip title={f({ id: "common.delete" })} placement="top">
          <i className="  ti-trash m-1" onClick={() => handelDeleteUser(id)}></i>
        </Tooltip>
      )}
    </>
  );

  // Table options
  const options = {
    ...MUIDataTableOptions,
    textLabels: {
      body: {
        // eslint-disable-next-line no-nested-ternary
        noMatch: loading ? (
          <CircularProgress />
        ) : locale === "en" ? (
          "No data to show"
        ) : (
          "لا يوجد بيانات للعرض"
        ),
      },
    },
    count: bookingsState?.metadata?.totalCount || -1,

    onColumnSortChange: (col, dir) => {},
    onTableChange: (action, tableState) => {
      if (tableState.rowsPerPage !== limit) {
        setLimit(tableState.rowsPerPage);
      }
      if (action === "changePage") {
        setPage(tableState.page);
      }
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <div className="d-flex justify-content-around m-2">
          {bookingsState?.metadata?.currentPage && (
            <>
              <Pagination
                showFirstButton
                showLastButton
                count={Math.ceil(count / rowsPerPage)}
                page={bookingsState?.metadata?.currentPage}
                onChange={(_, value) => {
                  setPage(value);
                  changePage(value);
                  history.replace({ hash: `page=${value}` });
                }}
              />
              <PerPage
                handlePerPageChange={(value) => {
                  setLimit(value);
                  changeRowsPerPage(value);
                }}
                setPage={setPage}
                perPage={rowsPerPage}
              />
            </>
          )}
        </div>
      );
    },
  };

  useEffect(() => {
    setBookingsState({
      collection: usersRes?.users?.collection.map((user) => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        <span className={`badge badge-${user?.isActive ? "success" : "danger"}`}>
          <FormattedMessage id={user?.isActive ? "active" : "inactive"} />
        </span>,
        user.roles.map((role) => (
          <span className="badge badge-secondary m-1">{role[`${locale}Name`]}</span>
        )),
        actions({ id: user.id }),
      ]),
      metadata: usersRes?.users?.metadata,
    });
  }, [usersRes]);

  return (
    <div className="mb-4">
      <MUIDataTable data={bookingsState.collection} columns={columns} options={options} />
    </div>
  );
}

UsersList.propTypes = {
  setPage: PropTypes.func,
  loading: PropTypes.bool,
  usersRes: PropTypes.object,
  setLimit: PropTypes.func,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default UsersList;
