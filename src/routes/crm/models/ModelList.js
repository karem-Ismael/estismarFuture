/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/** Bookings List */
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import { ActivateBranch } from "gql/mutations/ActivateBranch.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import { useMutation } from "@apollo/client";
import { DeleteCarModel } from "gql/mutations/DeleteCarModel.gql";
import swal from "sweetalert";
import { ModelData } from "./ModelData";

function ModelList({ allmodels, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [activateBranch] = useMutation(ActivateBranch);
  const [models, setModelsStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = models;
  const [deleteCarModel] = useMutation(DeleteCarModel);
  useEffect(() => {
    setModelsStates({
      collection: allmodels?.carModels?.collection,
      metadata: allmodels?.carModels?.metadata,
    });
  }, [allmodels]);
  const handleChange = (e, id) => {
    activateBranch({
      variables: {
        isActive: e.target.checked,
        branchId: id,
      },
    })
      .then((res) => {
        NotificationManager.success("StatusChangedSuccessfully ");
        refetch();
      })
      .catch((error) => {
        NotificationManager.error("Error");
      });
    // setavailabel(e.target.checked);
  };
  const handelDeleteModel = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.model" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteCarModel({
          variables: { id },
        })
          .then((res) => {
            NotificationManager.success(formatMessage({ id: "carModelDeletedSuccessfully" }));
          })
          .then(() => refetch())
          .catch((error) => NotificationManager.error(error?.message));
      }
    });
  };
  const actions = ({ id }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`models/${id}`}>
          <i className=" ti-eye m-1"></i>
        </Link>
      </Tooltip>

      {userCan("cars.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`models/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i className=" ti-trash m-1" onClick={() => handelDeleteModel(id)}></i>
      </Tooltip>
    </div>
  );
  return (
    <Typography component="div" style={{ padding: 10, marginTop: "20px" }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={ModelData}
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

ModelList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allmodels: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ModelList;
