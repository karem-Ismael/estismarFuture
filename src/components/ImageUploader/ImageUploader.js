/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import NoImage from "assets/img/no-image.png";
import { NotificationManager } from "react-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import reactImageSize from "react-image-size";

const maxSize = 1024 * 20;
function ImageUploader({
  titleId,
  image,
  setImage,
  required,
  loading,
  error,
  remove,
  imgremove = false,
  loader = false,
  imgheight = 400,
  imgwidth = 600,
  setLoader,
}) {
  useEffect(
    () => () => {
      const item = document.querySelector(`#${titleId}`);
      if (item) {
        item.value = "";
      }
    },
    [],
  );

  return (
    <div className={`form-group ${required ? "required" : ""}`}>
      <label className={`control-label ${error ? "error" : ""}`} htmlFor="image">
        <FormattedMessage id={titleId || "missing"} />
      </label>
      <div className="col-md-8">
        <div className="fileinput fileinput-new">
          <div className="fileinput-new thumbnail" style={{ marginBottom: "30px" }}>
            {!loader ? (
              <img width="100%" src={loading ? NoImage : image || NoImage} alt={titleId || ""} />
            ) : (
              <CircularProgress />
            )}
          </div>
          <div className="fileinput-preview fileinput-exists thumbnail"> </div>
          <div>
            <span className="btn btn-primary default btn-file">
              <span className="fileinput-new">
                {" "}
                <FormattedMessage id={image ? "changeImage" : "selectImage"} />{" "}
              </span>

              <input type="hidden" />
              <input
                name={titleId}
                id={titleId}
                type="file"
                accept="image/jpeg, jpeg, png, image/png, gif, image/gif"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) {
                    return;
                  }
                  const reader = new FileReader();

                  e.preventDefault();
                  let files;
                  if (e.dataTransfer) {
                    files = e.dataTransfer.files;
                  } else if (e.target) {
                    files = e.target.files;
                  }

                  if (file?.size / 1024 > maxSize) {
                    NotificationManager.error(
                      <FormattedMessage id="maximumAllowedImageSizeError" />,
                    );
                    return;
                  }
                  if (
                    !["image/jpeg", "jpeg", "png", "image/png", "gif", "image/gif"].includes(
                      files[0]?.type,
                    )
                  ) {
                    NotificationManager.error(<FormattedMessage id="uploadImageError" />);
                  }
                  reader.onload = () => {
                    reactImageSize(reader.result)
                      .then(({ width, height }) => {
                        if (width > imgwidth || height > imgheight) {
                          NotificationManager.error(
                            <FormattedMessage
                              id={`pleasecheckdiminssion${imgwidth}x${imgheight}`}
                            />,
                          );
                          // setImage("");
                          // setLoader(false);
                          return;
                        } else {
                          setImage(reader.result);
                        }
                      })
  
                  };
                  reader.readAsDataURL(files[0]);
                }}
              />
            </span>
            {imgremove && !loader ? (
              <span
                onClick={remove}
                className="btn btn-danger"
                style={{ marginLeft: "3px", marginRight: "3px" }}
              >
                {" "}
                <FormattedMessage id="remove" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

ImageUploader.propTypes = {
  titleId: PropTypes.string,
  image: PropTypes.any,
  required: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  setImage: PropTypes.func,
  imgremove: PropTypes.bool,
  remove: PropTypes.func,
  loader: PropTypes.bool,
};

export default ImageUploader;
