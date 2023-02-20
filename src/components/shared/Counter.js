import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import PropTypes from "prop-types";

function Counter({ counter, setIncOne, setDecOne, branchCount = undefined }) {
  const handleIncrement = () => {
    setIncOne(+counter + 1);
  };

  const handleDecrement = () => {
    setDecOne(+counter - 1);
  };

  return (
    <ButtonGroup
      size="small"
      aria-label="small outlined button group"
      dir="ltr"
      className="ml-3 mr-3"
    >
      <Button></Button>
      <Button disabled>{counter}</Button>
      <Button></Button>
    </ButtonGroup>
  );
}

Counter.propTypes = {
  counter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setIncOne: PropTypes.func,
  setDecOne: PropTypes.func,
};

export default Counter;
