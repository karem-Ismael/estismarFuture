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
import { DeleteBanner } from "gql/mutations/DeleteBanner.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import swal from "sweetalert";
import { BannerData } from "./BannerData";

function BannerList({ allbanners, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteBanner] = useMutation(DeleteBanner);
  const [banners, setBanners] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = banners;

  useEffect(() => {
    setBanners({
      collection: allbanners?.banners?.collection,
      metadata: allbanners?.banners?.metadata,
    });
  }, [allbanners]);

  const handelDeleteBanner = (id) => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.banner" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteBanner({
          variables: {
            id,
          },
        })
          .then(() => {
            refetch();
            NotificationManager.success(<FormattedMessage id="bannerdeletedsuccessfully" />);
          })
      }
    });
  };

  const actions = ({ id }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}

      {userCan("cars.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`banners/${id}/edit`}>
            <i className=" ti-pencil-alt m-1"></i>
          </Link>
        </Tooltip>
      )}
      <Tooltip title={formatMessage({ id: "common.delete" })} placement="top">
        <i
          style={{ cursor: "pointer" }}
          className=" ti-trash m-1"
          onClick={() => handelDeleteBanner(id)}
        ></i>
      </Tooltip>
    </div>
  );
  return (
    <Typography component="div" style={{ padding: "10px", marginTop: "20px" }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={BannerData}
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

BannerList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allbanners: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BannerList;
