/* eslint-disable eqeqeq */
/* eslint-disable no-undefined */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
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
import { Checkbox, FormGroup } from "@material-ui/core";
import { NotificationManager } from "react-notifications";
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
  const [reason, setReason] = useState([]);
  const toggle = () => setOpenModel(!openmodel);
  const Cancel = () => {
    setValue(orignalval);
    toggle();
  };
  const handleChange = (event) => {
    setReason([...reason, Number(event.target.value)]);
  };
  return (
    <div>
      <Modal isOpen={openmodel} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          <FormattedMessage id="b.c.r" />{" "}
        </ModalHeader>
        <ModalBody>
            <FormGroup>
              {reasons?.businessClosedReasons &&
                reasons?.businessClosedReasons.map((oneReason) => (
                  <FormControlLabel
                    control={<Checkbox onChange={handleChange} value={oneReason.id} name={oneReason.enName} />}
                    label={oneReason.body}
                  />
                ))}
          {reason.includes(7) && (
            <div className="row">
              <div className="col-10" style={{ margin: "auto" }}>
                <TextField
                  label={<FormattedMessage id="Other" />}
                  multiline
                  required
                  rows={4}
                  variant="outlined"
                  onChange={(e) => setNote(e.target.value)}
                  />
              </div>
            </div>
          )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={() => {
            if(reason.includes(7) && !note){
              NotificationManager.error(<FormattedMessage id="please enter close reason" />);
            }else if(reason?.length){
                performCloseRent(reason, note)
              }else{
                NotificationManager.error(<FormattedMessage id="please choose atleast one close reason" />);
              }
          }
        }>
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
