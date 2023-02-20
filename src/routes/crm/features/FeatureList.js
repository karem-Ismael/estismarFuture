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
import { DeleteFeature } from "gql/mutations/DeleteFeature.gql";
import UpdateFeature from "gql/mutations/UpdateFeature.gql";
import swal from "sweetalert";
import { FeatureData } from "./FeatureData";

function FeatureList({ allfeatures, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [updateFeature] = useMutation(UpdateFeature);
  const [models, setModelsStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = models;
  const [deleteFeature] = useMutation(DeleteFeature);
  useEffect(() => {
    setModelsStates({
      collection: allfeatures?.features?.collection,
      metadata: allfeatures?.features?.metadata,
    });
  }, [allfeatures]);
  useEffect(() => {
    refetch();
  }, []);
  const handleChange = (e, id) => {
    updateFeature({
      variables: {
        isActive: e.target.checked,
        featureId: id,
      },
    })
      .then((res) => {
        NotificationManager.success(<FormattedMessage id="StatusChangedSuccessfully" />);
        refetch();
      })
      .catch((error) => {
        NotificationManager.error(error?.message);
      });
    // setavailabel(e.target.checked);
  };
  const handelDeleteFeature = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.feature" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteFeature({
          variables: { featureId: id },
        })
          .then((res) => {
            NotificationManager.success(formatMessage({ id: "FeatureDeletedSuccessfully" }));
          })
          .then(() => refetch())
          .catch((error) => NotificationManager.error(error?.message));
      }
    });
  };
  const actions = ({ id, isActive }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`features/${id}`}>
          <i className=" ti-eye m-1"></i>
        </Link>
      </Tooltip>

      {userCan("cars.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`features/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i className=" ti-trash m-1" onClick={() => handelDeleteFeature(id)}></i>
      </Tooltip>
      {userCan("cars.activation") && (
        <Switch
          checked={isActive}
          color="primary"
          name={id}
          onChange={(e) => handleChange(e, id)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )}
    </div>
  );
  return (
    <Typography component="div" style={{ padding: 10, marginTop: "20px" }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={FeatureData}
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

FeatureList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allfeatures: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default FeatureList;
