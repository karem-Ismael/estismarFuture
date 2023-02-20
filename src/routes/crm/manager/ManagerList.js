/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/** Bookings List */
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip, Switch } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import { useMutation } from "@apollo/client";
import { DeleteAllyManager } from "gql/mutations/DeleteManager.gql";
import swal from "sweetalert";
import { ManagerData } from "./ManagerData";

function ManagerList({ allManagers, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [models, setModelsStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = models;
  const [deleteAllyManager] = useMutation(DeleteAllyManager);
  useEffect(() => {
    setModelsStates({
      collection: allManagers?.allyManagers?.collection,
      metadata: allManagers?.allyManagers?.metadata,
    });
  }, [allManagers]);
  useEffect(() => {
    refetch();
  }, []);
  const handelDeleteManager = (id,user) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.manager" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteAllyManager({
          variables: { input: { id:user.id } },
        })
          .then((res) => {
            NotificationManager.success(formatMessage({ id: "ManagerDeletedSuccessfully" }));
          })
          .then(() => refetch())
          .catch((error) => NotificationManager.error(error?.message));
      }
    });
  };
  const actions = ({ id, isActive,isDeleted ,user}) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`managers/${id}`}>
          <i className=" ti-eye"></i>
        </Link>
      </Tooltip>

      {userCan("ally_companies.update") && !isDeleted &&  (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`manager/${id}/edit`}>
            <i className=" ti-pencil-alt"></i>
          </Link>
        </Tooltip>
      )}
      {
        !isDeleted && 
        <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i className=" ti-trash" onClick={() => handelDeleteManager(id,user)}></i>
      </Tooltip>
      }
      
    </div>
  );
  return (
    <Typography component="div" style={{ padding: 10 }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={ManagerData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "isActive","isDeleted","user"]}
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

ManagerList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allManagers: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ManagerList;
