import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { CarVersion } from "gql/queries/GetCarVersion.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { useIntl } from "react-intl";
import { Gallery, Item } from "react-photoswipe-gallery";
import { VersionDisplayData } from "./VersionDisplayData";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";

/**
 * @name VersionDetails
 * @export
 * @return {JSX}
 */
export default function VersionDetails() {
  const location = useLocation();
  const { versionid } = useParams();
  const history = useHistory();

  const { formatMessage, locale } = useIntl();
  const { data: carVersion, refetch } = useQuery(CarVersion, {
    variables: { id: +versionid },
  });
  const MyGallery = () => (
    <Gallery style={{ wigth: "100%" }}>
      <div className="row justify-content-space-between">
        {carVersion?.carVersion.images?.map((img) => (
          <Item original={img} width="300" height="300">
            {({ ref, open }) => (
              <div className="col-lg-4 col-md-12  ">
                <img
                  ref={ref}
                  onClick={open}
                  src={img}
                  width="300"
                  className="shadow-lg cursor-pointer  p-5 mb-5 bg-white rounded "
                />
              </div>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "version.details" })}</title>
        <meta name="description" content="Carwah Model Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="version.details" />}
        enableBreadCrumb
        match={location}
        lastElement={versionid || <DotsLoader />}
      />
      <div className="row">
        {carVersion && (
          <div className="w-50">
            <VersionDisplayData versionprofile={carVersion} />
          </div>
        )}
        {carVersion?.carVersion.images && carVersion?.carVersion.images.length > 0 ? (
          <div className="w-50">
            <>
              <p>{formatMessage({ id: "CarThumbimage" })}</p>
              {carVersion?.carVersion.image && (
                <img
                  style={{
                    verticalAlign: "middle",
                    // borderRadius: "50%",
                  }}
                  className="w-75 mb-4 avatar"
                  src={carVersion?.carVersion.image}
                  alt={formatMessage({ id: "CarThumbimage" })}
                />
              )}
            </>
          </div>
        ) : null}
      </div>

      <div>
        {carVersion?.carVersion.images.length ? (
          <>
            <p>{formatMessage({ id: "carImage" })}</p>

            {MyGallery()}
          </>
        ) : null}
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row justify-content-end">
            <div className="col-md-2 mt-2">
              <button
                type="button"
                onClick={() => history.push(`/cw/dashboard/versions/${versionid}/edit`)}
                className="btn btn-primary text-center text-white"
              >
                {formatMessage({ id: "Edit" })}
              </button>{" "}
            </div>
            <div className="col-md-2 mt-2">
              <button
                onClick={() => history.push("/cw/dashboard/versions")}
                type="button"
                className="btn btn-danger text-white text-center"
              >
                {formatMessage({ id: "button.back" })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
