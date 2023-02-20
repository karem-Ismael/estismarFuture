/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/**
 * Custom Table
 */
import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { CircularProgress } from "@material-ui/core";
import { Alert } from "constants/constants";
import Checkbox from "@material-ui/core/Checkbox";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CellData from "./CellData";

function CustomTableDnd({
  tableData,
  tableRecords,
  actions,
  loading,
  actionsArgs,
  setCarIds,
  carIds,
  AssignBooking,
  RefundBooking,
  withcheckbox = false,
  setAllChecked,
  allchecked,
  onRowDragEnd,
  loadingSort,
}) {
  const { locale } = useIntl();
  const onSelectAllClick = (e) => {
    if (e.target.checked) {
      setAllChecked(true);
      const ids = [];
      tableRecords.map((record) => ids.push(record.id));
      setCarIds(ids);
    } else {
      setAllChecked(false);
      setCarIds([]);
    }
  };
  const onSingleCheck = (e, index, record) => {
    const ids = [...carIds];
    if (e.target.checked) {
      setCarIds([...carIds, record.id]);
    } else {
      const filteredids = ids.filter((id) => id != record.id);
      setCarIds(filteredids);
    }
  };

  return (
    <DragDropContext onDragEnd={onRowDragEnd}>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr data-testid="header-row">
              {withcheckbox && (
                <th>
                  <Checkbox
                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={allchecked}
                    onChange={onSelectAllClick}
                    inputProps={{ "aria-label": "select all desserts" }}
                  />
                </th>
              )}
              <th>#</th>
              {tableData?.map((header, idx) => (
                <th key={JSON.stringify(idx)} align="center">
                  <div
                    key={header?.headerId}
                    role="button"
                    className={`${header?.withAction ? "pointer" : ""}`}
                    onKeyDown={() => header?.handleAction()}
                    onClick={() => header?.handleAction()}
                    tabIndex={0}
                  >
                    <span
                      data-testid="capitalized-header"
                      style={{ textTransform: "capitalize" }}
                    >
                      {header?.headerId && (
                        <FormattedMessage
                          id={header?.headerId || Alert("Missing Header ID")}
                        />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {!loading && !loadingSort ? (
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {tableRecords?.map((record, idx) => (
                    <Draggable draggableId={`${Number(idx)}`} index={idx}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={JSON.stringify(idx)}
                          data-testid={`data-tr-${idx}`}
                        >
                          {withcheckbox && (
                            <td>
                              <Checkbox
                                checked={carIds?.includes(record.id)}
                                onChange={(e) => onSingleCheck(e, idx, record)}
                                inputProps={{
                                  "aria-label": "select all desserts",
                                }}
                              />
                            </td>
                          )}
                          <td> {idx + 1}</td>

                          {tableData.map((data, index) => (
                            <>
                              <td
                                key={JSON.stringify(index)}
                                align={`${data?.align || ""}`}
                              >
                                {CellData({
                                  data,
                                  record,
                                  locale,
                                  actions,
                                  actionsArgs,
                                  AssignBooking,
                                  RefundBooking,
                                })}
                              </td>
                            </>
                          ))}
                        </tr>
                      )}
                    </Draggable>
                  ))}
                </tbody>
              )}
            </Droppable>
          ) : null}
        </table>
        {tableRecords && tableRecords.length === 0 && (
          <div className="text-center mt-3 mb-4">
            <FormattedMessage id="No data found" />
          </div>
        )}
      </div>
      {(loading || loadingSort) && (
        <div className="d-flex justify-content-center">
          <CircularProgress />
        </div>
      )}
    </DragDropContext>
  );
}

CustomTableDnd.propTypes = {
  tableData: PropTypes.array,
  tableRecords: PropTypes.array,
  actionsArgs: PropTypes.array,
  actions: PropTypes.any,
  loading: PropTypes.bool,
};

export default CustomTableDnd;
