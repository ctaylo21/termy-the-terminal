import React from 'react';
import PropTypes from 'prop-types';

function Input({ handleKeyPress }) {
  return <input type="text" onKeyPress={handleKeyPress} />;
}

Input.propTypes = {
  handleKeyPress: PropTypes.func.isRequired,
};

export default Input;
