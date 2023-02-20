/* eslint-disable prettier/prettier */
/**
 * Page Title Bar Component
 * Used To Display Page Title & Breadcrumbs
 */
import React from "react";
import PropTypes from "prop-types";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";

// intl messages
import IntlMessages from "Util/IntlMessages";

// get display string
const getDisplayString = (sub, lastElement, isLast) => {
  const arr = sub.split("-");
  if (arr.length > 1) {
    return (
      <IntlMessages
        id={`sidebar.${
          arr[0].charAt(0) + arr[0].slice(1) + arr[1].charAt(0).toUpperCase() + arr[1].slice(1)
        }`}
      />
    );
  }
  return lastElement && isLast ? (
    <>{lastElement}</>
  ) : (
    <IntlMessages id={`sidebar.${sub.charAt(0) + sub.slice(1)}`} />
  );
};

// get url string
const getUrlString = (path, sub, index) => {
  if (index === 0) {
    return "/";
  }
  return `/${path.split(sub)[0]}${sub}`;
};

const PageTitleBar = ({ title, match, enableBreadCrumb, extraButtons, lastElement }) => {
  const path = match?.path?.substr(1) || match?.pathname?.substr(1);
  const subPath = path?.split("/");
  return (
    <>
      <div className="page-title d-flex justify-content-between align-items-center">
        {title && (
          <div className="page-title-wrap">
            <h2 className="">{title}</h2>
          </div>
        )}
        <div>{extraButtons}</div>
      </div>
      {enableBreadCrumb && (
        <Breadcrumb className="mb-0 tour-step-7" tag="nav">
          {subPath
            .filter((sub) => !["extend", "edit", "changestatus", "statistics"].includes(sub))
            .map((sub, index, arr) => (
              <BreadcrumbItem
                active={arr.length === index + 1}
                tag={arr.length === index + 1 ? "span" : Link}
                key={JSON.stringify(index)}
                to={getUrlString(path, sub, index)}
              >
                {getDisplayString(sub, lastElement, arr.length === index + 1)}
              </BreadcrumbItem>
            ))}
        </Breadcrumb>
      )}
    </>
  );
};

PageTitleBar.propTypes = {
  extraButtons: PropTypes.any,
  title: PropTypes.object,
  match: PropTypes.object,
  enableBreadCrumb: PropTypes.bool,
  lastElement: PropTypes.any,
};

export default PageTitleBar;
