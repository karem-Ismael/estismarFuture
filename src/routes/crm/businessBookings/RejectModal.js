import { Cancel } from "@material-ui/icons";
import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FormattedMessage, useIntl } from "react-intl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

const RejectModal = (props) => {
  const {
    buttonLabel,
    className,
    openmodel,
    setOpenModel,
    reasons,
    setValue,
    orignalval,
    rejectRent,
  } = props;

  const [note, setNote] = useState("");
  const { locale, formatMessage } = useIntl();
  const [reason, setReason] = useState("");
  const toggle = () => setOpenModel(!openmodel);
  const Cancel = () => {
    setValue(orignalval);
    toggle();
  };
  const handleChange = (event) => {
    setReason(event.target.value);
  };
  // alert("s");
  return (
    <div>
      <Modal isOpen={openmodel} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          <FormattedMessage id="b.c.r" />{" "}
        </ModalHeader>
        <ModalBody>
          <List style={{ overflowY: "scroll", maxHeight: "300px" }}>
            <RadioGroup aria-label="gender" name="gender1" value={reason} onChange={handleChange}>
              {reasons?.rejectedReasons &&
                reasons?.rejectedReasons.map((oneReason) => {
                  return (
                    <ListItem role={undefined} dense button>
                      <ListItemIcon>
                        <FormControlLabel
                          value={oneReason.id}
                          control={<Radio style={{ minWidth: "13px !importnat " }} />}
                          style={{ minWidth: "13px" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={oneReason?.[`${locale}Body`]}
                        style={{ textAlign: "initial" }}
                      />
                    </ListItem>
                  );
                })}
            </RadioGroup>
          </List>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => rejectRent(reason)}>
            <FormattedMessage id="rejectRent" />
          </Button>{" "}
          <Button color="danger" onClick={() => Cancel()}>
            <FormattedMessage id="cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RejectModal;
