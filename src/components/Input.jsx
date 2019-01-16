import React from 'react';
import PropTypes from 'prop-types';

function Input({ handleKeyPress, prompt }) {
  return (
    <div id="input-container">
      <span>{prompt}</span>
      <input type="text" onKeyPress={handleKeyPress} />
    </div>
  );
}

Input.propTypes = {
  handleKeyPress: PropTypes.func.isRequired,
  prompt: PropTypes.string.isRequired,
};

export default Input;
