/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
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
import PerPage from "components/shared/PerPage";
import { ActivateBranch } from "gql/mutations/ActivateBranch.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import { useMutation } from "@apollo/client";
import { DeleteExtraService } from "gql/mutations/DeleteExtraService.gql";
import UpdateFeature from "gql/mutations/UpdateFeature.gql";
import swal from "sweetalert";
import CustomTableDnd from "components/shared/CustomTableDnd";
import UpdateExtraService from "gql/mutations/EditExtraService.gql";
import SortExtraService from "gql/mutations/SortExtraService.gql";
import { ExtraSerivceData } from "./ExtraServiceData";

function ExtraServiceList({ allservice, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [sortExtraService, { loading: loadingSort }] = useMutation(SortExtraService);
  const [updateFeature] = useMutation(UpdateFeature);
  const [models, setModelsStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = models;
  const [deleteExtraService] = useMutation(DeleteExtraService);
  useEffect(() => {
    setModelsStates({
      collection: allservice?.extraServices?.collection,
      metadata: allservice?.extraServices?.metadata,
    });
  }, [allservice]);
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
        NotificationManager.error("Error");
      });
    // setavailabel(e.target.checked);
  };
  const handelDeleteService = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.service" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteExtraService({
          variables: { extraServiceId: +id },
        })
          .then((res) => {
            NotificationManager.success(formatMessage({ id: "ServiceDeletedSuccessfully" }));
          })
          .then(() => refetch())
          .catch((error) => NotificationManager.error(error?.message));
      }
    });
  };
  const actions = ({ id, isActive }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects t
      o Car details */}
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`extraservices/${id}`}>
          <i className=" ti-eye m-1"></i>
        </Link>
      </Tooltip>

      {userCan("cars.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`extraservice/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i className=" ti-trash m-1" onClick={() => handelDeleteService(id)}></i>
      </Tooltip>
    </div>
  );
  function onRowDragEnd(result) {
    const { destination, source, reason } = result;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const arr = [];
    for (let i = 0; i < collection.length; i++) {
      if (source.index === i) {
        arr.push(
          { id: collection[i].id, displayOrder: destination.index },
          { id: collection[destination.index].id, displayOrder: source.index },
        );
      }
      if (source.index !== i && destination.index !== i) {
        arr.push({ id: collection[i].id, displayOrder: i });
      }
    }
    sortExtraService({
      variables: {
        extraServicesArr: arr,
      },
    })
      .then(() => {
        NotificationManager.success(formatMessage({ id: "success.edit.extraservice" }));
        refetch();
      })
      .catch((err) => {
        NotificationManager.error(err?.message);
      });
  }
  return (
    <Typography component="div" style={{ padding: 10, marginTop: "20px" }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTableDnd
            tableData={ExtraSerivceData}
            loading={loading}
            loadingSort={loadingSort}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "isActive"]}
            onRowDragEnd={onRowDragEnd}
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

ExtraServiceList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allservice: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ExtraServiceList;
