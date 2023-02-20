import React from "react";
import { useHistory } from "react-router";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const perPageRanges = [10, 25, 50, 100];

function PerPage({ perPage, handlePerPageChange, specialPagination, setPage }) {
  const history = useHistory();
  const paginationRange = specialPagination || perPageRanges;
  return (
    <Select
      displayEmpty
      value={perPage}
      onChange={(e) => {
        handlePerPageChange(e.target.value);
        setPage(1);
        history.replace({ hash: `page=1` });
      }}
      input={<Input />}
      renderValue={(selected) =>
        selected.length === 0 ? <FormattedMessage id="components.perpage.limit" /> : selected
      }
      inputProps={{ "aria-label": "Without label" }}
    >
      <MenuItem disabled value="">
        <em>
          <FormattedMessage id="components.perpage.limit" />
        </em>
      </MenuItem>
      {paginationRange.map((name) => (
        <MenuItem key={name} value={name}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}

PerPage.propTypes = {
  perPage: PropTypes.number,
  handlePerPageChange: PropTypes.func,
  specialPagination: PropTypes.array,
  setPage: PropTypes.func,
};

export default PerPage;
