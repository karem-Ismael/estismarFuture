/** Bookings List */
import React, { useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip, Switch } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import { useMutation } from "@apollo/client";
import { userCan } from "functions/userCan";
import { DeleteCarVersion } from "gql/mutations/DeleteVersion.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { ActivateCarVersion } from "gql/mutations/ActivateCarVersion.gql";
import swal from "sweetalert";
import { VersionData } from "./VersionData";

function VersionList({ allVersions, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const [deleteCarVersion] = useMutation(DeleteCarVersion);
  const { formatMessage } = useIntl();
  const [versions, setVersionStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = versions;
  const [activateCarVersion] = useMutation(ActivateCarVersion);

  useEffect(() => {
    setVersionStates({
      collection: allVersions?.carVersions?.collection,
      metadata: allVersions?.carVersions?.metadata,
    });
  }, [allVersions]);

  const handelDeleteVersion = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.version" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteCarVersion({
          variables: {
            carVersionId: id,
          },
        })
          .then(() => refetch())
          .then((res) =>
            swal(formatMessage({ id: "versiondeletedsuccessfully" }), {
              icon: "success",
            }),
          )
          .catch((error) => {
            NotificationManager.error(`${error?.message}`);
          });
      }
    });
  };
  const handleChange = (e, id) => {
    activateCarVersion({
      variables: {
        isActive: e.target.checked,
        carVersionId: +id,
      },
    })
      .then((res) => {
        refetch();
      })
      .then(() =>
        setTimeout(
          () => NotificationManager.success(<FormattedMessage id="StatusChangedSuccessfully" />),
          2500,
        ),
      )
      .catch((error) => {
        NotificationManager.error(error?.message);
      });
  };

  const actions = ({ id, isActive }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`versions/${id}`}>
          <i className=" ti-eye m-1"></i>
        </Link>
      </Tooltip>
      {userCan("car_versions.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`versions/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("car_versions.delete") && (
        <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
          <i
            style={{ cursor: "pointer" }}
            className="ti-trash m-1"
            onClick={() => handelDeleteVersion(id)}
          ></i>
        </Tooltip>
      )}
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
    <Typography component="div" style={{ padding: 10 }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={VersionData}
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

VersionList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allVersions: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default VersionList;
