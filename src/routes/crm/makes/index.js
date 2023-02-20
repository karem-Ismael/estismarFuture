/**
 * Makes Page
 */
import React, { useState, Component } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// page title bar
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
// rct card box
import { RctCard, RctCardContent } from "Components/RctCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
// component
import CreateMake from "./component/CreateMake";
import MakesTab from "./component/MakesTab";
// import { FiltersAndSearches } from "components/FiltersAndSearches";

export default function Makes() {
  const location = useLocation();
  const [refetch, setRefetch] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.makes" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.makes" />}
        enableBreadCrumb
        match={location}
        extraButtons={
          <CreateMake
            requestData={() => {
              setRefetch(true);
              setRefetch(false);
            }}
          />
        }
      />
      {/* <div className="search-bar-wrap"> */}
      {/* <RctCard> */}
      {/* <RctCardContent> */}
      {/* <div className="row"> */}
      {/* <FiltersAndSearches
                    // setPage={setPage}
                    // query={query}
                    // setQuery={setQuery}
                    submitbtnid="search.filter"
                    fields={[
                      { type: "search", name: "customerName" },
                      { type: "search", name: "email" },
                      // { type: "search", name: "nid" },  // TODO: Uncomment for adding national id search
                    ]}
                  /> */}
      {/* // </div> */}
      {/* // </RctCardContent> */}
      {/* // </RctCard> */}
      {/* // </div> */}
      <div style={{ marginTop: "30px" }}>
        <RctCard>
          <MakesTab requestData={refetch} />
        </RctCard>
      </div>
    </div>
  );
}
