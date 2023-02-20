import TableSortLabel from "@material-ui/core/TableSortLabel";
import React, { useState } from "react";

const SortByComponent = ({ children, orderBy, setOrderBy, setSortBy }) => {
  const [direction, setDirection] = useState("asc");
  const Handledirection = (e) => {
    if (!setSortBy) {
      if (direction == "asc") {
        setOrderBy(orderBy);
      } else {
        setOrderBy(`${orderBy}_desc`);
      }
    } else {
      setSortBy(direction);
      setOrderBy(orderBy);
    }
    setDirection(direction === "asc" ? "desc" : "asc");
  };
  return (
    <TableSortLabel direction={direction === "asc" ? "desc" : "asc"} onClick={Handledirection}>
      {children}
    </TableSortLabel>
  );
};
export default SortByComponent;
