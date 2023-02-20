import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @name CustomDialog
 * @param {
 *   actiontype Default behavior to consider it confirm/cancel buttons
 *      other wise you'll need to create locale with ${actionType}.ok & ${actionType}.cancel
 *   example (in en.json):
 *   "repleceme.ok": "OK",
 *   "repleceme.cancel": "Never",
 *
 *   customAction {JSX}
 *   width,
 *   withaction,
 *   title,
 *   button,
 *   open,
 *   handleOk,
 *   handleCancel,
 *   handleOpen,
 *   content,
 * }
 * @returns {JSX}
 */
function CustomDialog({
  width,
  actiontype,
  withaction,
  title,
  button,
  open,
  handleOk,
  handleCancel,
  content,
  customAction,
}) {
  return (
    <>
      {button}
      <Dialog
        open={open}
        onClose={handleCancel}
        fullWidth
        maxWidth={width || "sm"}
        aria-labelledby="form-dialog-title"
      >
        {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
        <DialogContent>{content}</DialogContent>
        {!customAction && withaction && (
          <DialogCustomAction
            actionType={actiontype}
            handleCancel={handleCancel}
            handleOk={handleOk}
          />
        )}
        {customAction && { customAction }}
      </Dialog>
    </>
  );
}

CustomDialog.propTypes = {
  content: PropTypes.any,
  open: PropTypes.bool,
  width: PropTypes.string,
  withaction: PropTypes.bool,
  actiontype: PropTypes.string,
  button: PropTypes.element,
  customAction: PropTypes.element,
  title: PropTypes.element,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
};

function DialogCustomAction({ handleCancel, handleOk, actionType }) {
  return (
    <DialogActions>
      <Button autoFocus onClick={handleCancel} color="primary">
        <FormattedMessage id={`${!actionType ? "common.cancel" : `${actionType}.cancel`}`} />
      </Button>
      <Button onClick={handleOk} color="primary">
        <FormattedMessage id={`${!actionType ? "common.confirm" : `${actionType}.ok`}`} />
      </Button>
    </DialogActions>
  );
}

DialogCustomAction.propTypes = {
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  actionType: PropTypes.string,
};

export default CustomDialog;
