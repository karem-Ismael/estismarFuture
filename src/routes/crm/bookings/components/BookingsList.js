/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/** Bookings List */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip, Button } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

// import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import { userCan } from "functions/userCan";
import { daysDifference } from "functions";

import { useQuery, useMutation } from "@apollo/client";
import { AssignRentalTo } from "gql/mutations/AssignRentalTo.gql";
import { AssignRentalToMe } from "gql/mutations/AssignBookingToMe.gql";
import { PrintRental } from "gql/mutations/PrintRental.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import swal from "sweetalert";
import TimeLine from "./TimeLineModal";
import store from "../../../../store";
import { bookingTableData } from "./BookingTableData";
import UsersModal from "./UsersModal";
import Refund from "./Refund";
import print from "print-js";
import ExtendModal from "./ExtendModal";
import CircularProgress from '@material-ui/core/CircularProgress';

const { is_super_user, ally_id } = store.getState()?.authUser.user;

function BookingsList({
  bookingsRes,
  loading,
  setPage,
  limit,
  setLimit,
  users,
  refetch,
  setOrderBy,
  setSortBy,
  decodedUserId,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [OpenUsersModal, setOpenUsersModal] = useState(false);
  const [bookingsState, setBookingsState] = useState({
    collection: [],
    metadata: {},
  });
  const [assignRentalTo] = useMutation(AssignRentalTo);
  const [printrental] = useMutation(PrintRental);
  const [assignRentalToMe] = useMutation(AssignRentalToMe);
  const { collection, metadata } = bookingsState;
  const [customerCare, setCustomerCare] = useState([]);
  const [BookingRecord, setBookingRecord] = useState({});
  const [opneTimeLineModal, setOpenTimeLineModal] = useState(false);
  const [BookingId, setBookingId] = useState();
  const [openmodel, setOpenModel] = useState(false);
  const[printProgress,setPrintProgress]=useState(false)

  useEffect(() => {
    setBookingsState({
      collection: bookingsRes?.dashboardRentals?.collection,
      metadata: bookingsRes?.dashboardRentals?.metadata,
    });
  }, [bookingsRes]);
  useEffect(() => {
    if (users?.length) {
      setCustomerCare(users);
    }
  }, [users]);
  const actions = ({ id, dropOffDate, pickUpDate, status,lastRentalDateExtensionRequest }) => {
    const [DOdate, PUdate] = [dropOffDate, pickUpDate];

    const getRentalAudits = (id) => {
      setBookingId(id);
      setOpenTimeLineModal(true);
    };
    const handelPrint = (id) => {
      setPrintProgress(true)
      printrental({
        variables: {
          rentalId: id,
        },
      }).then((data) => {
        setPrintProgress(false)
        print({ printable: data.data.printRental.fileBase64, type: "pdf", base64: true });
      });
    };
    const getRentalExtend = (id) => {
      setBookingId(id);
      setOpenModel(true);
    };
    return (
      <div className="d-flex align-items-center" style={{ gap: "5px" }}>
        {/* Redirects to booking/rental details */}
        <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
          <Link to={`bookings/${id}`}>
            <i className="fa fa-eye"></i>
          </Link>
        </Tooltip>
        {userCan("rentals.update") && (
          <>
            {/* CAN EXTEND */}
            {daysDifference(PUdate, DOdate, status) === "IN_BETWEEN" && (
              <>
                <Tooltip title={formatMessage({ id: "extend" })} placement="top">
                  <Link to={`bookings/${id}/extend`}>
                    <i className="fa fa-calendar-plus-o"></i>
                  </Link>
                </Tooltip>
              </>
            )}
            {/* CAN CHANGE STATUS */}
            {daysDifference(PUdate, DOdate, status) !== "STOP_EDIT" && (
              <Tooltip title={formatMessage({ id: "changeStatus" })} placement="top">
                <Link to={`changestatus/${id}`}>
                  <i className="fa fa-refresh"></i>
                </Link>
              </Tooltip>
            )}
            {/* CAN EDIT */}
            {/* THIS Part of code is the correct one and it will be applied after an approval from the client */}
            {daysDifference(PUdate, DOdate, status) !== "STOP_EDIT" && status !== "car_received" && (
              // <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
              //   <Link to={`bookings/${id}/edit`}>
              //     <i className="fa fa-edit mr-1 ml-1"></i>
              //   </Link>
              // </Tooltip>
              <></>
            )}
            <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
              <Link to={`bookings/${id}/edit`}>
                <i className="fa fa-edit"></i>
              </Link>
            </Tooltip>
            {
              userCan("rentals.print") && 
              <Tooltip title={formatMessage({ id: "common.print" })} placement="top">
              <i
                className="fa fa-print"
                style={{ color: "#5d89d8",cursor:"pointer" }}
                onClick={() => handelPrint(id)}
              ></i>
              {/* karem */}
            </Tooltip>
            }
           

            {is_super_user && (
              <Tooltip title={formatMessage({ id: "common.timeline" })} placement="top">
                <Link>
                  <i className="fas fa-history" onClick={() => getRentalAudits(id)}></i>
                </Link>
              </Tooltip>
            )}
          </>
        )}
         {lastRentalDateExtensionRequest && userCan("rentals.extend")&& (
          <Tooltip title={formatMessage({ id: "extend" })}>
            <i
              className="fa fa-external-link"
              onClick={() => getRentalExtend(id)}
              style={{ color: "#5d89d8", cursor: "pointer" }}
            ></i>
            
          </Tooltip>
        )}

        {/* <div>
          <ExtendModal setOpenModel={setOpenModel} openmodel={openmodel} />
        </div> */}
      </div>
    );
  };

  const AssignUserToBooking = (record, isSuperAdmin) => {
    if (isSuperAdmin) {
      setBookingRecord(record);
      setOpenUsersModal(true);
    } else {
      swal({
        title: formatMessage({ id: "are.u.sure.?" }),
        text: formatMessage({ id: `u.want.to.Assign.this.Booking.to.u` }),
        icon: "warning",
        buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "button.yes" })],
        dangerMode: true,
      }).then((Yes) => {
        if (Yes) {
          assignRentalToMe({
            variables: {
              rentalId: +record.id,
            },
          }).then(() => {
            refetch();
            NotificationManager.success(<FormattedMessage id="BookingAssignedSuccessfully" />);
          });
        }
      });
    }
  };
  const AssignBookingBySuperUser = (BookingDetails, customerid) => {
    const customerName = customerCare.find((customer) => +customer.id == +customerid)?.name;
    if (!customerid) {
      NotificationManager.error(<FormattedMessage id="please.select.one.of.customercare" />);
      return;
    }
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: `${formatMessage({ id: `u.want.to.Assign.this.Booking` })} ${customerName}`,
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "button.yes" })],
      dangerMode: true,
    }).then((Yes) => {
      if (Yes) {
        assignRentalTo({
          variables: {
            rentalId: BookingDetails.id,
            userId: customerid,
          },
        }).then(() => {
          refetch();
          NotificationManager.success(<FormattedMessage id="BookingAssignedSuccessfully" />);
          setOpenUsersModal(false);
        });
      }
    });
  };
  const AssignBooking = (record) => (
    <>
      {record.assignedTo && !is_super_user ? null : (
        <Button
          variant="contained"
          color="primary"
          className="mx-smt-15 btn btn-danger mr-1 ml-1"
          onClick={() => {
            AssignUserToBooking(record, is_super_user);
          }}
        >
          <FormattedMessage id={!is_super_user ? "AssignToMe" : "AssignTo"} />
        </Button>
      )}

      {customerCare.find((customer) => +customer.id == +record.assignedTo)?.name}
    </>
  );
  const refund = (record) =>
    userCan("rentals.refund") && record.refundable ? (
      <div style={{ textAlign: "center" }}>
        <p>{record.paymentMethod}</p>
        {record.isPaid && record.paymentMethod == "ONLINE" ? (
          <>
            <p className="badge badge-info">
              {" "}
              <FormattedMessage id="payed" />
            </p>
          </>
        ) : !record.isPaid &&
          record.paymentMethod == "ONLINE" &&
          !record.paymentMethod == "CASH" ? (
          <FormattedMessage id="notpayed" />
        ) : null}
        {!ally_id && (
          <Refund
            rentalid={record.id}
            is24Passed={record.is24Passed}
            refetch={refetch}
            bookingDetails={record}
          />
        )}
      </div>
    ) : (
      <div>
        <p>
          {" "}
          <FormattedMessage id={record?.paymentMethod} />{" "}
        </p>
        {record.isPaid && record.paymentMethod == "ONLINE" ? (
          <>
            {!record.refundedAt && (
              <p className="badge badge-success">
                <FormattedMessage id="payed" />
              </p>
            )}
            {record.refundedAt && (
              <p className="badge badge-danger">
                <FormattedMessage id="refund.money" />
              </p>
            )}
          </>
        ) : !record.isPaid && record.paymentMethod == "ONLINE" ? (
          <FormattedMessage id="notpayed" />
        ) : null}
      </div>
    );
  return (
    <Typography component="div" style={{ padding: 10,position:"relative" }}>
      <div>
      {/* {
          printProgress && 
            <div className="progress-print" style={{width:"calc(100vw - 8.1rem)",height:"100vh",position:"absolite", display: "flex", justifyContent: "center", alignItems:"center", zIndex:"99", top:"45vh", left:"0"}}>
            <CircularProgress/>

            </div>

          } */}
        <UsersModal
          isOpen={OpenUsersModal}
          setOpenUsersModal={setOpenUsersModal}
          customerCare={customerCare}
          BookingDetails={BookingRecord}
          AssignBookingBySuperUser={AssignBookingBySuperUser}
        />
        <TimeLine
          isOpen={opneTimeLineModal}
          setOpenTimeLineModal={setOpenTimeLineModal}
          BookingId={BookingId}
        />
         <ExtendModal
          setOpenModel={setOpenModel}
          openmodel={openmodel}
          BookingId={BookingId}
          refetch={refetch}
        />
        <RctCollapsibleCard fullBlock table>
          
          <CustomTable
            tableData={bookingTableData}
            loading={printProgress || loading}
            tableRecords={collection}
            actions={actions}
            AssignBooking={AssignBooking}
            RefundBooking={refund}
            actionsArgs={["id", "pickUpDate", "dropOffDate", "status", "pickUpTime", "dropOffTime","lastRentalDateExtensionRequest"]}
            setOrderBy={setOrderBy}
            setSortBy={setSortBy}
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
                history.replace({ hash: `page=${value}`, search: history?.location?.search });
              }}
            />
            <PerPage
              handlePerPageChange={(value) => {
                setLimit(value);
                setPage(1);
                history.replace({ hash: `page=1` });
              }}
              perPage={limit}
              setPage={setPage}
            />
          </>
        )}
      </div>
    </Typography>
  );
}

BookingsList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  loading: PropTypes.bool,
  bookingsRes: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BookingsList;
