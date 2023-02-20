/**
 * Confirmation dialog component
 */
import React from "react";
import PropTypes from "prop-types";
import { Button, DialogContent, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

class ConfirmationDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
    this.closeDialog = this.closeDialog.bind(this);
  }

  // Define function for open confirmation dialog box
  openDialog() {
    this.setState({ open: true });
  }

  // Define function for close confirmation dialog box and callback for delete item
  closeDialog(isTrue) {
    this.setState({ open: false });
    this.props.onConfirm(isTrue);
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.closeDialog}
        aria-labelledby="responsive-dialog-title"
        className="confirmation-dialog"
      >
        <DialogTitle>{this.props.dialogtitle}</DialogTitle>
        <DialogContent className="p-20 text-center">
          <h4 className="pt-20">
            <FormattedMessage id={this.props.dialogmessageid} />
          </h4>
        </DialogContent>
        <DialogActions className="px-20 pb-20 justify-content-center" autoFocus>
          <Button
            onClick={() => this.closeDialog(true)}
            className="btn-primary text-white fw-semi-bold mr-15"
          >
            <FormattedMessage id="common.confirm" />
          </Button>
          <Button
            onClick={() => this.closeDialog(false)}
            className="btn-danger text-white fw-semi-bold"
          >
            <FormattedMessage id="common.cancel" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  dialogmessageid: PropTypes.string,
  dialogtitle: PropTypes.object,
  onConfirm: PropTypes.func,
};

export default ConfirmationDialog;
