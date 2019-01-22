import React from 'react';
import PropTypes from 'prop-types';
import InputPrompt from './InputPrompt';

function Input({
  currentPath,
  handleChange,
  handleSubmit,
  inputValue,
  promptChar,
}) {
  return (
    <div id="input-container">
      <form onSubmit={handleSubmit}>
        <InputPrompt path={currentPath} promptChar={promptChar} />
        <input type="text" value={inputValue} onChange={handleChange} />
      </form>
    </div>
  );
}

Input.propTypes = {
  currentPath: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  promptChar: PropTypes.string.isRequired,
};

export default Input;
