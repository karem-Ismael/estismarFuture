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
import "./style.css";
const ReasonsModal = (props) => {
  const {
    buttonLabel,
    className,
    openmodel,
    setOpenModel,
    reasons,
    setValue,
    orignalval,
    performCloseRent,
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
  return (
    <div>
      <Modal isOpen={openmodel} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          <FormattedMessage id="b.c.r" />{" "}
        </ModalHeader>
        <ModalBody>
          <List style={{ overflowY: "scroll", maxHeight: "300px" }}>
            <RadioGroup aria-label="gender" name="gender1" value={reason} onChange={handleChange}>
              {reasons?.cancelledReasons &&
                reasons?.cancelledReasons.map((oneReason) => {
                  return (
                    <ListItem role={undefined} dense button
                    onClick={()=>{

                      setReason(oneReason.id)
                    }}
                    >
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
          <div className="row">
            <div className="col-10" style={{ margin: "auto" }}>
              <TextField
                label={<FormattedMessage id="note" />}
                multiline
                required={+reason == 998}
                rows={4}
                variant="outlined"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => performCloseRent(reason, note)}>
            <FormattedMessage id="closeRental" />
          </Button>{" "}
          <Button color="danger" onClick={() => Cancel()}>
            <FormattedMessage id="cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ReasonsModal;
