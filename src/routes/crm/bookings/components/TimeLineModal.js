import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useQuery } from "@apollo/client";
import { RentalsAudits } from "gql/queries/BookingTimeLine.gql";
import moment from "moment";

import "./style.css";
// import { JSONParser } from "@amcharts/amcharts4/core";
const TimeLine = (props) => {
  const { locale } = useIntl();

  const { className } = props;
  const [oldData, setOldData] = useState();
  const [newData, setNewData] = useState();

  const { data: rentalAudits, refetch } = useQuery(RentalsAudits, {
    skip: !props.BookingId,
    variables: { id: props.BookingId },
  });
  useEffect(() => {
    if (rentalAudits?.rentalsAudits?.length) {
      const newData = [];
      const oldData = [];
      rentalAudits?.rentalsAudits?.map((rental, i) => {
        newData.push(JSON.parse(rental?.newData));
        oldData.push(JSON.parse(rental?.oldData));
      });
      setOldData(oldData);
      setNewData(newData);
    }
  }, [rentalAudits]);
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
        {rentalAudits?.rentalsAudits.length ? (
          <div class="container" style={{ height: "500px", overflowY: "auto" }}>
            <div class="row">
              <div class="col-md-10">
                <ul class="cbp_tmtimeline">
                  <li>
                    <div class="cbp_tmicon">
                      <i class="zmdi zmdi-account"></i>
                    </div>
                    <div class="cbp_tmlabel empty">
                      {" "}
                      <span style={{ fontWeight: "bold" }}>
                        <FormattedMessage id="bookingId.placeholder" /> :
                        {rentalAudits?.rentalsAudits[0].rentalId}
                      </span>{" "}
                    </div>
                  </li>

                  {rentalAudits?.rentalsAudits.map((rental, index) => (
                    <li>
                      <time
                        class="cbp_tmtime"
                        style={{ left: locale == "ar" ? "1px" : "" }}
                        datetime=""
                      >
                        <span>{rental.userName}</span>{" "}
                        <span style={{ direction: "ltr" }}>
                          {moment.utc(rental.createdAt).local().format("DD/MM/YYYY h:mm:ss a")}
                        </span>
                      </time>
                      <div class="cbp_tmicon bg-info">
                        <i class="zmdi zmdi-label"></i>
                      </div>

                      <div class="cbp_tmlabel d-flex" style={{ justifyContent: "space-between" }}>
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
                                    {<FormattedMessage id={key ? `${key}` : "0"} />}
                                    {": "}
                                    {val &&
                                    val != null &&
                                    (key === "pick_up_time" || key === "drop_off_time")
                                      ? moment(`${oldData[index]["pick_up_date"]} ${val}`).format(
                                          "h:mm:ss a",
                                        )
                                      : val != null &&
                                        (val.length || val) && <FormattedMessage id={val} />}{" "}
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
                                    {<FormattedMessage id={key ? key : "0"} />} :{" "}
                                    {val &&
                                    val != null &&
                                    (key === "pick_up_time" || key === "drop_off_time")
                                      ? moment(`${newData[index]["pick_up_date"]} ${val}`).format(
                                          "h:mm:ss a",
                                        )
                                      : val != null &&
                                        (val.length || val) && <FormattedMessage id={val} />}{" "}
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
