import React from 'react';
import PropTypes from 'prop-types';

function InputPrompt({ path, promptChar }) {
  return (
    <>
      <span id="inputPromptPath">{path}</span>
      &nbsp;
      <span id="inputPromptChar">{promptChar}</span>
    </>
  );
}

InputPrompt.propTypes = {
  path: PropTypes.string.isRequired,
  promptChar: PropTypes.string.isRequired,
};

export default InputPrompt;
