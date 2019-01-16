import React from 'react';
import PropTypes from 'prop-types';

function Input({ handleKeyPress }) {
  return (
    <div id="input-container">
      <input type="text" onKeyPress={handleKeyPress} />
    </div>
  );
}

Input.propTypes = {
  handleKeyPress: PropTypes.func.isRequired,
};

export default Input;
