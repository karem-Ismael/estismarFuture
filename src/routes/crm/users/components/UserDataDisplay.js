import React from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { GetCustomerDetailsQuery } from "gql/queries/Users.queries.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { UserDataDisplay } from "components/UserDataDisplay";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * @name UserDataDisplayComponent
 * @export
 * @return {JSX}
 */
export default function UserDataDisplayComponent() {
  const location = useLocation();
  const history = useHistory();
  const { userId } = useParams();
  const { data: UserDetails } = useQuery(GetCustomerDetailsQuery, {
    variables: { id: +userId },
  });
  const { locale } = useIntl();

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>User Details</title>
        <meta name="description" content="Carwah Booking Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="user.details" />}
        enableBreadCrumb
        match={location}
        lastElement={UserDetails?.user?.name || <DotsLoader />}
      />
      <div className="row">
        <div className="w-50">
          <UserDataDisplay userDetails={UserDetails} withimages={false} />
        </div>
        <div>
          <h4>
            <FormattedMessage id="sidebar.roles" />
          </h4>
          {UserDetails?.user?.roles.map((role) => (
            <span className="badge badge-secondary m-1">{role[`${locale}Name`]}</span>
          ))}
        </div>
      </div>
      {UserDetails?.user?.id && (
        <div className="d-flex flex-row-reverse m-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push(`/cw/dashboard/users/${UserDetails?.user?.id}/edit`)}
          >
            <FormattedMessage id="common.editSomething" values={{ something: "user" }} />
          </button>
        </div>
      )}
    </div>
  );
}
