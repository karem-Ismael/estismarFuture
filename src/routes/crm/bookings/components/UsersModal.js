import { Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FormattedMessage, useIntl } from "react-intl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const UsersModal = (props) => {
  const {
    className,
    isOpen,
    setOpenUsersModal,
    customerCare,
    BookingDetails,
    AssignBookingBySuperUser,
  } = props;
  const [customerid, setCustomerId] = useState();
  const { locale, formatMessage } = useIntl();
  const toggle = () => setOpenUsersModal(!isOpen);
  const Cancel = () => {
    toggle();
  };
  const handleChange = (event) => {
    setCustomerId(event.target.value || customerid);
  };
  useEffect(() => {
    if (BookingDetails.assignedTo) {
      setCustomerId(BookingDetails.assignedTo);
    }
  }, [BookingDetails]);
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          <FormattedMessage id="c.c.l" />{" "}
        </ModalHeader>
        <ModalBody>
          <List style={{ overflowY: "scroll", maxHeight: "300px" }}>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={customerid}
              onChange={handleChange}
            >
              {customerCare &&
                customerCare.map((customer) => {
                  return (
                    <ListItem role={undefined} dense button onClick={()=>{

                      setCustomerId(customer.id)
                    }}>
                      <ListItemIcon>
                        <FormControlLabel
                          value={customer.id}
                          control={<Radio style={{ minWidth: "13px !importnat " }} checked={customer.id == customerid} />}
                          style={{ minWidth: "13px" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={customer.name} style={{ textAlign: "initial" }} />
                    </ListItem>
                  );
                })}
            </RadioGroup>
          </List>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => AssignBookingBySuperUser(BookingDetails, customerid)}
          >
            <FormattedMessage id={"AssignTo"} />
          </Button>{" "}
          <Button color="danger" onClick={() => Cancel()}>
            <FormattedMessage id="cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UsersModal;
