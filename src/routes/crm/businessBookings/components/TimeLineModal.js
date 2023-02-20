/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useQuery } from "@apollo/client";
import { BusinessRentalAudits } from "gql/queries/BookingTimeLine.gql";
import moment from "moment";

import "./style.css";
// import { JSONParser } from "@amcharts/amcharts4/core";
const TimeLine = (props) => {
  const { locale } = useIntl();

  const { className } = props;
  const [oldData, setOldData] = useState();
  const [newData, setNewData] = useState();

  const { data: businessRentalAudits, refetch } = useQuery(BusinessRentalAudits, {
    skip: !props.BookingId,
    variables: { id: props.BookingId },
  });
  useEffect(() => {
    if (businessRentalAudits?.businessRentalAudits?.length) {
      const newData = [];
      const oldData = [];
      businessRentalAudits?.businessRentalAudits?.map((rental, i) => {
        newData.push(JSON.parse(rental?.newData));
        oldData.push(JSON.parse(rental?.oldData));
      });
      setOldData(oldData);
      setNewData(newData);
    }
  }, [businessRentalAudits]);
  useEffect(() => {
    if (!props.BookingId) {
      return;
    }
    refetch();
  }, [props.isOpen]);
  const toggle = () => props.setOpenTimeLineModal(!props.isOpen);

  return (
    <Modal isOpen={props.isOpen} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>
        <FormattedMessage id="BookingTimeLine" />
      </ModalHeader>
      <ModalBody>
        {businessRentalAudits?.businessRentalAudits.length ? (
          <div className="container" style={{ height: "500px", overflowY: "auto" }}>
            <div className="row">
              <div className="col-md-10">
                <ul className="cbp_tmtimeline">
                  <li>
                    <div className="cbp_tmicon">
                      <i className="zmdi zmdi-account"></i>
                    </div>
                    <div className="cbp_tmlabel empty">
                      {" "}
                      <span style={{ fontWeight: "bold" }}>
                        <FormattedMessage id="bookingId.placeholder" /> :
                        {businessRentalAudits?.businessRentalAudits[0].businessRentalId}
                      </span>{" "}
                    </div>
                  </li>

                  {businessRentalAudits?.businessRentalAudits.map((rental, index) => (
                    <li>
                      <time
                        className="cbp_tmtime"
                        style={{ left: locale == "ar" ? "1px" : "" }}
                        dateTime=""
                      >
                        <span>{rental.userName}</span>{" "}
                        <span style={{ direction: "ltr" }}>
                          {moment.utc(rental.createdAt).local().format("DD/MM/YYYY h:mm:ss a")}
                        </span>
                      </time>
                      <div className="cbp_tmicon bg-info">
                        <i className="zmdi zmdi-label"></i>
                      </div>

                      <div
                        className="cbp_tmlabel d-flex"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="w-50">
                          <h2 style={{ fontWeight: "bold" }}>
                            <FormattedMessage id="oldData" />
                          </h2>
                          <ul>
                            {oldData &&
                              oldData[index] &&
                              Object.entries(oldData[index]).map(([key, val]) => (
                                <>
                                  <li>
                                    <FormattedMessage id={key ? `${key}` : "0"} />
                                    {": "}
                                    {val &&
                                    val != null &&
                                    (key === "pick_up_time" || key === "drop_off_time")
                                      ? moment(`${oldData[index].pick_up_date} ${val}`).format(
                                          "h:mm:ss a",
                                        )
                                      : val != null &&
                                        val.length && <FormattedMessage id={val} />}{" "}
                                  </li>
                                </>
                              ))}
                          </ul>
                        </div>
                        <div className="w-50">
                          <h2 style={{ fontWeight: "bold" }}>
                            <FormattedMessage id="newData" />
                          </h2>
                          <ul>
                            {newData &&
                              newData[index] &&
                              Object.entries(newData[index]).map(([key, val]) => (
                                <>
                                  <li>
                                    <FormattedMessage id={key || "0"} /> :{" "}
                                    {val &&
                                    val != null &&
                                    (key === "pick_up_time" || key === "drop_off_time")
                                      ? moment(`${newData[index].pick_up_date} ${val}`).format(
                                          "h:mm:ss a",
                                        )
                                      : val != null &&
                                        val.length && <FormattedMessage id={val} />}{" "}
                                  </li>
                                </>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <FormattedMessage id="No data found" />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
export default TimeLine;
