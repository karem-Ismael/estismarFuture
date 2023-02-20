/**
 * Active User Component
 */
import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Scrollbars } from "react-custom-scrollbars";
import { Label, Input } from "reactstrap";
import { FormattedMessage } from "react-intl";
import "./style.css";
export default function Shifts({ data }) {
  return (
    <>
      <Scrollbars
        className="rct-scroll"
        autoHeight
        autoHeightMin={100}
        autoHeightMax={380}
        autoHide
      >
        <List className="list-unstyled p-0">
          {data &&
            data.map((work, index) => (
              <ListItem key={index} className="border-bottom d-flex justify-content-between p-20">
                <div className="w-60 ">
                  <Label for="exampleUrl">
                    <FormattedMessage id="starttime" />{" "}
                  </Label>
                  <Input
                    type="datetime"
                    name="datetime"
                    id="exampleDatetime"
                    placeholder="datetime placeholder"
                    defaultValue={work.is24hAvailable ? "00:00" : work.startTime}
                    disabled
                  />
                </div>
                <div className="w-60">
                  <Label for="exampleUrl">
                    <FormattedMessage id="endtime" />
                  </Label>
                  <Input
                    type="datetime"
                    name="datetime"
                    id="exampleDatetime"
                    placeholder="datetime placeholder"
                    defaultValue={work.is24hAvailable ? "23:59" : work.endTime}
                    disabled
                  />
                </div>
              </ListItem>
            ))}
        </List>
      </Scrollbars>
    </>
  );
}
