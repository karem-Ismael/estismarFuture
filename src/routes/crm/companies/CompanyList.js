/* eslint-disable prettier/prettier */
/**
 * Bookings List
 */
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
import { useMutation } from "@apollo/client";
import { ActivateAllyCompany } from "gql/mutations/ActivateAlly.gql";
import Switch from "@material-ui/core/Switch";
import { NotificationManager } from "react-notifications";
import { userCan } from "functions/userCan";
import { CompanyData } from "./CompanyData";
function CompanyList({ allyCompanies, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [allyCompany, setAllyCompany] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = allyCompany;
  const [activateAllyCompany] = useMutation(ActivateAllyCompany);
  useEffect(() => {
    setAllyCompany({
      collection: allyCompanies?.allyCompanies?.collection,
      metadata: allyCompanies?.allyCompanies?.metadata,
    });
  }, [allyCompanies]);
  const handleChange = (e, id) => {
    activateAllyCompany({
      variables: {
        allyCompanyId: id,
        isActive: e.target.checked,
      },
    })
      .then((res) => refetch())
      .then(() => NotificationManager.success(<FormattedMessage id="StatusSucessfully" />))
      .catch((err) => {
        NotificationManager.erro(err?.message);
      });
  };
  const actions = ({ id, isActive }) => (
    <div className="d-flex align-items-center">
      <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
        <Link to={`companies/${id}`}>
          <i className=" ti-eye m-1"></i>
        </Link>
      </Tooltip>
      <Switch
        checked={isActive}
        color="primary"
        name={id}
        onChange={(e) => handleChange(e, id)}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      {userCan("ally_companies.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`companies/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
    </div>
  );
  return (
    <Typography component="div" style={{ padding: 10 }}>
      <div style={{ marginTop: "20px" }}>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={CompanyData}
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

CompanyList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allyCompanies: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CompanyList;
