/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/** Bookings List */
import React, { useEffect } from "react";
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
import swal from "sweetalert";
import { DeleteBranch } from "gql/mutations/DeleteBranch.gql";
import { BranchData } from "./BranchData";

function BranchList({ allbranches, loading, setPage, limit, setLimit, refetch, isDeltedFilterSelected }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [activateBranch] = useMutation(ActivateBranch);
  const [deleteBranch] = useMutation(DeleteBranch);

  const [branches, setBranchesStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = branches;

  useEffect(() => {
    setBranchesStates({
      collection: allbranches?.branches?.collection,
      metadata: allbranches?.branches?.metadata,
    });
  }, [allbranches]);
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

  const handleDelete = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.branch" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteBranch({
          variables: { branchId: id },
        })
          .then((res) => {
            if (res.data.deleteBranch.status === "success")
              NotificationManager.success(formatMessage({ id: "BranchDeletedSuccessfully" }));
          })
          .then(() => refetch())
          .catch((error) => {
            NotificationManager.error(error.message);
          });
      }
    });
  };

  const actions = ({ id, isActive }) => {  
    const isdeltedAtExist = branches?.collection?.filter(i => i.deletedAt)?.length;
    return(
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {userCan("branches.update") && (
        <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
          <Link to={`branches/${id}`}>
            <i className=" ti-eye"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("branches.activation") && !isdeltedAtExist && (
        <Switch
          checked={isActive}
          color="primary"
          name={id}
          onChange={(e) => handleChange(e, id)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )}
      {userCan("branches.update") && !isdeltedAtExist && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`branches/${id}/edit`}>
            <i className=" ti-pencil-alt"></i>
          </Link>
        </Tooltip>
      )}

      {userCan("branches.delete") && !isdeltedAtExist && (
        <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
          <i
            className=" ti-trash m-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(id);
            }}
          ></i>
        </Tooltip>
      )}
    </div>
    )
  };
  return (
    <Typography component="div" style={{ padding: 10 }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={BranchData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "isActive", "isDeleted"]}
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

BranchList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allbranches: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BranchList;
