/* eslint-disable jsx-a11y/control-has-associated-label */
/**
 * Create Version  Page
 */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import { FileUploader } from "components/ImageUploader";
import { ImageUpload } from "gql/mutations/UploadImage.gql";
import { CreateBanner } from "gql/mutations/CreateBanner.gql";
import { UpdateBanner } from "gql/mutations/UpdateBanner.gql";
import { NotificationManager } from "react-notifications";
import { Banner } from "gql/queries/getBanner.gql";
import CustomTextField from "components/Input/CustomTextField";
import Select from "react-select";
import { BannerStatus } from "constants/constants";
import { AllBanners } from "gql/queries/getAllBanners.gql";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
export default function AddEditBanner() {
  const { bannerId } = useParams();
  const [errors, setErrors] = useState();
  const { formatMessage } = useIntl();
  const history = useHistory();
  const [ArImage, setArImage] = useState();
  const [isActive, setIsActive] = useState();
  const [displayOrder, setDisplayOrder] = useState();
  const [loader, setLoader] = useState(false);
  const [Arloader, setArLoader] = useState(false);

  const [imageUpload] = useMutation(ImageUpload);
  const { data: banner, refetch ,loading:BannerLoader} = useQuery(Banner, {
    skip: !bannerId,
    variables: {
      id: +bannerId,
    },
  });
  const { data: banners, refetch: allBanners } = useQuery(AllBanners, {
    variables: { page: 1, limit: 10 },
  });
  const [createBanner] = useMutation(CreateBanner);
  const [updateBanner] = useMutation(UpdateBanner);
  const [EnImage, setEnImage] = useState();
  const handelSaveCar = () => {
    if (bannerId) {
      updateBanner({
        variables: {
          displayOrder,
          id: +bannerId,
          imgAr: ArImage,
          imgEn: EnImage,
          isActive: isActive.value != "false",
        },
      }).then(() => {
        NotificationManager.success(<FormattedMessage id="bannereditedsuccessfully" />);
        refetch();
        history.push("/cw/dashboard/banners");
      });
      return;
    }
    const geterrors = {};
    if (!ArImage) {
      geterrors.ArImage = "thisfieldisrequired";
    }
    if (!EnImage) {
      geterrors.EnImage = "thisfieldisrequired";
    }
    if (!displayOrder) {
      geterrors.displayOrder = "thisfieldisrequired";
    }

    if (!Object.keys(geterrors).length) {
      createBanner({
        variables: {
          displayOrder,
          imgAr: ArImage,
          imgEn: EnImage,
          isActive: isActive?.value != "false",
        },
      })
        .then((res) => {
          allBanners();
        })
        .then(() => {
          NotificationManager.success(<FormattedMessage id="BannerAddSuccessfully" />);
          history.push("/cw/dashboard/banners");
        })
        .catch((error) => NotificationManager.error(error));
    } else {
      setErrors(geterrors);
    }
  };

  const uploadEnimage = (file) => {
    setLoader(true);
    imageUpload({
      variables: {
        image: file,
        topic: "English Banner  Image ",
      },
    }).then((res) => {
      setLoader(false);
      setEnImage(res.data.imageUpload.imageUpload.imageUrl);
    });
  };
  const uploadArimage = (file) => {
    setArLoader(true);
    imageUpload({
      variables: {
        image: file,
        topic: "Arabic Banner  Image ",
      },
    }).then((res) => {
      setArLoader(false);

      setArImage(res.data.imageUpload.imageUpload.imageUrl);
    });
  };
  const handelChange = (e) => {
    setDisplayOrder(+e.target.value);
  };
  useEffect(() => {
    if (banner) {
      if (banner?.banner?.isActive) {
        setIsActive({ label: formatMessage({ id: "active" }), value: banner?.banner?.isActive });
      } else {
        setIsActive({ label: formatMessage({ id: "inactive" }), value: banner?.banner?.isActive });
      }
      setDisplayOrder(banner.banner.displayOrder);
      setEnImage(banner.banner.imgEn);
      setArImage(banner.banner.imgAr);
    }
  }, [banner]);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>
          {formatMessage({ id: bannerId ? "sidebar.EditBanner" : "sidebar.AddBanner" })}
        </title>
      </Helmet>

      <PageTitleBar
        title={<IntlMessages id={bannerId ? "sidebar.EditBanner" : "sidebar.AddBanner"} />}
        match={location}
        lastElement={bannerId ? bannerId : <IntlMessages id={"sidebar.AddBanner"} />}
        enableBreadCrumb
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        autoComplete="off"
      >
        <div className="row">
          {((bannerId && !BannerLoader) || !bannerId) && (
            <div className="col-md-6">
              <CustomTextField
                fullWidth
                onChange={handelChange}
                value={displayOrder}
                type="number"
                required
                name="sortorder"
                error={errors?.displayOrder}
              />
              {errors?.displayOrder && (
                <helperText className="text-danger">
                  <FormattedMessage id="thisfieldisrequired" />
                </helperText>
              )}
            </div>
          )}
          <div className="col-md-6">
            <Select
              className="dropdown-select mb-4"
              options={BannerStatus(formatMessage)}
              placeholder={formatMessage({ id: "status" })}
              onChange={(selection) => {
                setIsActive(selection);
              }}
              value={isActive}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <FileUploader
              loader={loader}
              titleId="EnImage"
              image={EnImage}
              required
              setImage={(file) => {
                uploadEnimage(file);
              }}
            />
            {errors?.EnImage && (
              <helperText className="text-danger">
                <FormattedMessage id="thisfieldisrequired" />
              </helperText>
            )}
          </div>
          <div className="col-md-6">
            <FileUploader
              titleId="ArImage"
              loader={Arloader}
              image={ArImage}
              required
              setImage={(file) => {
                uploadArimage(file);
              }}
            />
            {errors?.EnImage && (
              <helperText className="text-danger">
                <FormattedMessage id="thisfieldisrequired" />
              </helperText>
            )}
          </div>
        </div>
        <div className="row justify-content-end">
          <div className="col-md-6">
            <div className="row justify-content-center">
              <div className="col-md-3 mt-2">
                <button
                  type="button"
                  onClick={() => handelSaveCar()}
                  className="btn btn-primary text-center text-white"
                >
                  <FormattedMessage id="save" />
                </button>{" "}
              </div>
              <div className="col-md-3 mt-2">
                <button
                  onClick={() => history.goBack()}
                  type="button"
                  className="btn btn-danger text-white text-center"
                >
                  <FormattedMessage id="cancel" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
