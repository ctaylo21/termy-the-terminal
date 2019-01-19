import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Input extends Component {
  handleChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  render() {
    const { inputValue = ''} = this.state;
    const { handleKeyPress, inputPrompt } = this.props;

    return (
      <div id="input-container">
        <span>{inputPrompt}</span>
        <input type="text" onKeyPress={handleKeyPress} value={inputValue} onChange={this.handleChange} />
      </div>
    );
  }
}

Input.propTypes = {
  handleKeyPress: PropTypes.func.isRequired,
  inputPrompt: PropTypes.string.isRequired,
};
