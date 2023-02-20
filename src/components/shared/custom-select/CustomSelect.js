import React from "react";
import PropTypes from "prop-types";
import { ButtonGroup, Button, CircularProgress } from "@material-ui/core";
import Select, { components } from "react-select";
import { FormattedMessage, useIntl } from "react-intl";

const Menu = (props) => (
  <>
    <components.Menu {...props}>
      <div style={{ minHeight: "auto" }} className="d-flex flex-column">
        <div style={{ flex: "1 0 auto" }}>
          {props.selectProps.fetchingData ? (
            <span className="fetching">
              <CircularProgress />
            </span>
          ) : (
            <div>{props.children}</div>
          )}
        </div>
        <ButtonGroup fullWidth size="lg" dir="ltr" width="100%">
          <Button
            onClick={props.selectProps.nextPage}
            disabled={
              +props?.selectProps?.pagination?.currentPage ===
              +props?.selectProps?.pagination?.totalPages
            }
          >
            <FormattedMessage id="next" />
          </Button>
          <Button
            onClick={props.selectProps.previousPage}
            disabled={+props?.selectProps?.pagination?.currentPage === 1}
          >
            <FormattedMessage id="previous" />
          </Button>
        </ButtonGroup>
      </div>
    </components.Menu>
  </>
);

Menu.propTypes = {
  selectProps: PropTypes.any,
  children: PropTypes.any,
};

const Option = (props) => (
  <>
    <components.Option {...props}>{props.children}</components.Option>
  </>
);

Option.propTypes = {
  children: PropTypes.any,
};

const CustomSelect = ({
  options,
  nextPage,
  previousPage,
  fetchingData,
  onChange,
  placeholder,
  pagination,
  ...props
}) => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <Select
        className="dropdown-select"
        options={options}
        pagination={pagination}
        components={{ Menu, Option }}
        placeholder={formatMessage({ id: placeholder || "missing" })}
        fetchingData={fetchingData}
        nextPage={nextPage}
        previousPage={previousPage}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  fetchingData: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  pagination: PropTypes.object,
};

export default CustomSelect;
