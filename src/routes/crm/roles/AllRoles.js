/**
 * Bookings/Rentals Page
 */
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/client";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import { RolesList } from "gql/queries/GetRoles.gql";
import { getPageFromHash } from "functions";
import RoleList from "./RoleList";

export default function AllRoles() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("asc");
  const { data: allRoles, refetch, loading } = useQuery(RolesList, {
    variables: { page, limit, sort },
  });
  useEffect(() => {
    refetch();
  }, []);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.roles" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.roles" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <Button
            variant="contained"
            color="primary"
            className="mx-sm-15 btn btn-success"
            onClick={() => history.push("roles/add")}
          >
            <IntlMessages id="create.new.something" values={{ something: messages?.role }} />
          </Button>
        }
      />
      <RoleList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        allRoles={allRoles}
      />
    </div>
  );
}
