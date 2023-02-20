/* eslint-disable prettier/prettier */
/** Bookings List */
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
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
import { ActivateCar } from "gql/mutations/ActivateCar.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import { CarData } from "./CarData";
function CarList({
  allCars,
  loading,
  setPage,
  limit,
  setLimit,
  refetch,
  url,
  carIds,
  setCarIds,
  allchecked,
  setOrderBy,
  setAllChecked,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [activateCar] = useMutation(ActivateCar);
  const [cars, setCarStates] = useSetState({
    collection: [],
    metadata: {},
  });

  useEffect(() => {
    refetch();
  }, []);
  const { collection, metadata } = cars;

  useEffect(() => {
    setCarStates({
      collection: allCars?.allyCars?.collection,
      metadata: allCars?.allyCars?.metadata,
    });
  }, [allCars]);
  const handleChange = (e, id) => {
    activateCar({
      variables: {
        availabilityStatus: e.target.checked,
        carId: id,
      },
    })
      .then(() => {
        refetch();
      })
      .then(() => NotificationManager.success(<FormattedMessage id="StatusSucessfully" />))
      .catch((error) => {
        NotificationManager.error(error?.message);
      });
  };

  const actions = ({ id, availabilityStatus }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`cars/${id}`}>
          <i className=" ti-eye"></i>
        </Link>
      </Tooltip>
      {userCan("cars.activation") && (
        <Switch
          checked={availabilityStatus}
          color="primary"
          name={id}
          onChange={(e) => handleChange(e, id)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )}
      {userCan("cars.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link
            to={{
              pathname: `cars/${id}/edit`,
              state: { detail: url },
            }}
          >
            <i className=" ti-pencil-alt"></i>
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
            tableData={CarData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "availabilityStatus"]}
            setCarIds={setCarIds}
            carIds={carIds}
            withcheckbox
            allchecked={allchecked}
            setAllChecked={setAllChecked}
            // refetch={refetch}
            setOrderBy={setOrderBy}

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

CarList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allCars: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  url: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CarList;
