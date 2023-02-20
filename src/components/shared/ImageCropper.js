// Image Cropper

import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Cropper from "react-cropper";
import { FormGroup, FormText } from "reactstrap";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      cropResult: null,
    };
  }

  onCropperInit(cropper) {
    this.cropper = cropper;
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (!["image/jpeg", "jpeg", "png", "image/png", "gif", "image/gif"].includes(files[0]?.type)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
      this.props.setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.props.setImage(this.cropper.getCroppedCanvas().toDataURL());
    this.setState({
      cropResult: this.cropper.getCroppedCanvas().toDataURL(),
    });
  }

  _crop() {
  }

  render() {
    return (
      <div className="image-cropper-wrap">
        <div className="row">
          <RctCollapsibleCard
            colClasses="col-sm-12 col-md-12 col-lg-6"
            heading={<IntlMessages id="button.cropImage" />}
            contentCustomClasses="crop-wrapper"
          >
            <div>
              <Cropper
                style={{ height: 100, width: "100%" }}
                preview=".img-preview"
                guides
                src={this.state.src}
                crop={this._crop.bind(this)}
                onInitialized={this.onCropperInit.bind(this)}
              />
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-100 mb-10 mb-md-0">
                  <input
                    type="file"
                    name={this.props.name}
                    id="exampleFile"
                    onChange={this.onChange.bind(this)}
                    accept="image/png, image/jpeg"
                  />
                  <FormText color="muted">
                    <FormattedMessage id="choose.an.image" />
                  </FormText>
                </div>
              </FormGroup>
              <div className="d-flex align-items-center justify-content-center mb-10">
                <Button
                  onClick={this.cropImage.bind(this)}
                  variant="contained"
                  className="bg-success text-white w-100"
                >
                  <IntlMessages id="button.cropImage" />
                </Button>
              </div>
            </div>
          </RctCollapsibleCard>
          <RctCollapsibleCard
            colClasses="col-sm-12 col-md-12 col-lg-6"
            heading={<IntlMessages id="widgets.preview" />}
            contentCustomClasses="d-flex"
          >
            {this.props.image && (
              <img style={{ width: "100%" }} src={this.props.image} alt="cropped_img" />
            )}
          </RctCollapsibleCard>
        </div>
      </div>
    );
  }
}
export default ImageCropper;
