/* eslint-disable prettier/prettier */
/* eslint-disable no-undefined */
/** Bookings List */
import React, { useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip, TextField } from "@material-ui/core";
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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import UpdateCoupon from "gql/mutations/UpdateCoupon.gql";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "moment/locale/en-au";
import "moment/locale/ar-sa";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { CouponsData } from "./CouponsData";
function CouponList({ allcoupons, loading, setPage, limit, setLimit, refetch }) {
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const [activateBranch] = useMutation(ActivateBranch);
  const [updateCoupon] = useMutation(UpdateCoupon);
  const [startDate, setStartDate] = useState();
  const [expireDate, setExpireDate] = useState();
  const [startAt, setStartAt] = useState();
  const [expireAt, setExpireAt] = useState();

  const [coupons, setCouponsStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = coupons;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [couponId, setCouponId] = useState();
  const [mustChange, setMustChange] = useState(false);

  useEffect(() => {
    setCouponsStates({
      collection: allcoupons?.coupons?.collection,
      metadata: allcoupons?.coupons?.metadata,
    });
  }, [allcoupons]);
  const handleChange = (e, id, expireAt, startAt) => {
    setStartDate(startAt);
    setExpireDate(expireAt);
    setStartAt(startAt);
    setExpireAt(expireAt);
    setOpen(true);
    setCouponId(id);
    setActive(e.target.checked);
    if (moment(expireAt).diff(moment(), "days") < 0) {
      setMustChange(true);
    }

    // activateBranch({
    //   variables: {
    //     isActive: e.target.checked,
    //     branchId: id,
    //   },
    // })
    //   .then(() => {
    //     NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
    //     refetch();
    //   })
    //   .catch((err) => {
    //     NotificationManager.error(err?.message);
    //   });
  };

  const actions = ({ id, isActive, expireAt, startAt }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {/* Redirects to Car details */}
      {userCan("coupons.view") && (
        <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
          <Link to={`coupons/${id}`}>
            <i className=" ti-eye"></i>
          </Link>
        </Tooltip>
      )}
      {/* {userCan("coupons.activation") && (
        <Switch
          checked={isActive}
          color="primary"
          name={id}
          onChange={(e) => handleChange(e, id)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )} */}
      {userCan("coupons.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`coupons/${id}/edit`}>
            <i className=" ti-pencil-alt"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("coupons.statistics") && (
        <Tooltip title={formatMessage({ id: "common.Statistics" })} placement="top">
          <Link to={`coupons/${id}/statistics`}>
            <i className="fa fa-area-chart" aria-hidden="true"></i>
          </Link>
        </Tooltip>
      )}
      {userCan("coupons.activation") && (
        <Switch
          checked={isActive}
          color="primary"
          name={id}
          onChange={(e) => handleChange(e, id, expireAt, startAt)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )}
    </div>
  );

  const Confirm = () => {
    if (active) {
      updateCoupon({
        variables: {
          isActive: true,
          couponId,
          startAt: startDate ? startDate.concat("T00:00:00") : undefined,
          expireAt: expireDate ? expireDate.concat("T23:59:00") : undefined,
        },
      }).then(() => {
        NotificationManager.success(<FormattedMessage id="activate.successfully" />);
        refetch();
        setOpen(!open);
      });
    } else {
      updateCoupon({
        variables: {
          isActive: false,
          couponId,
        },
      }).then(() => {
        NotificationManager.success(<FormattedMessage id="Deactivated.successfully" />);
        refetch();
        setOpen(!open);
      });
    }
  };

  return (
    <Typography component="div" style={{ padding: 10 }}>
      <div>
        <RctCollapsibleCard fullBlock table>
          <CustomTable
            tableData={CouponsData}
            loading={loading}
            tableRecords={collection}
            actions={actions}
            actionsArgs={["id", "isActive", "expireAt", "startAt"]}
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
            <Modal
              isOpen={open}
              toggle={() => {
                setOpen(!open);
              }}
            >
              <ModalHeader
                toggle={() => {
                  setOpen(!open);
                }}
              ></ModalHeader>
              <ModalBody>
                <div className="text-center">
                  <p>{formatMessage({ id: "are.u.sure.?" })}</p>
                  {active ? (
                    <p>{formatMessage({ id: `u.want.to.activate.this.coupon` })}</p>
                  ) : (
                    <p>{formatMessage({ id: `u.want.to.deactivate.this.coupon` })}</p>
                  )}
                </div>
                {active && mustChange && (
                  <div className="row mt-3 mb-3">
                    <div className="col-md-6">
                      <MuiPickersUtilsProvider
                        libInstance={moment}
                        utils={MomentUtils}
                        locale={locale}
                      >
                        <DatePicker
                          okLabel={formatMessage({ id: "ok" })}
                          cancelLabel={formatMessage({ id: "cancel" })}
                          clearLabel={formatMessage({ id: "clear" })}
                          clearable
                          style={{ width: "100%" }}
                          value={startAt}
                          onChange={(date) => {
                            setStartAt(date);
                            setStartDate(date.locale("en").format("DD/MM/YYYY"));
                          }}
                          name="start"
                          placeholder={formatMessage({ id: "start.date" })}
                          disablePast
                          required
                          className={startDate ? "" : "astrik"}
                          renderInput={(props) => <TextField {...props} />}
                          openTo="year"
                          views={["year", "month", "date"]}
                          format="DD-MM-YYYY"
                        />
                      </MuiPickersUtilsProvider>
                    </div>

                    <div className="col-md-6">
                      <MuiPickersUtilsProvider
                        libInstance={moment}
                        utils={MomentUtils}
                        locale={locale}
                      >
                        <DatePicker
                          okLabel={formatMessage({ id: "ok" })}
                          cancelLabel={formatMessage({ id: "cancel" })}
                          clearLabel={formatMessage({ id: "clear" })}
                          clearable
                          style={{ width: "100%" }}
                          value={expireAt}
                          onChange={(date) => {
                            setExpireAt(date);
                            setExpireDate(date.locale("en").format("DD/MM/YYYY"));
                          }}
                          name="enddate"
                          placeholder={formatMessage({ id: "end.date" })}
                          disablePast
                          required
                          renderInput={(props) => <TextField {...props} />}
                          openTo="year"
                          views={["year", "month", "date"]}
                          format="DD-MM-YYYY"
                        />
                      </MuiPickersUtilsProvider>
                      <ErrorMessage
                        condition={moment(expireAt).diff(moment(startAt), "days") < 0}
                        errorMsg={formatMessage({
                          id: "End date must be greater or equal to start date",
                        })}
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={() => setOpen(!open)}>
                  {formatMessage({ id: "no" })}
                </Button>
                <Button
                  color="info"
                  onClick={Confirm}
                  disabled={
                    (active && mustChange && moment(startAt).diff(moment(), "days") < 0) ||
                    (active && expireAt && moment(expireAt).diff(moment(), "days") < 0) ||
                    (active && moment(expireAt).diff(moment(startAt), "days") < 0) ||
                    (active && !startAt)
                  }
                >
                  {formatMessage({ id: "yes" })}
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}
      </div>
    </Typography>
  );
}

CouponList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  allcoupons: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CouponList;
