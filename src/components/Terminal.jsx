import React, { Component } from 'react';
import PropTypes from 'prop-types';
import History from './History';
import Input from './Input';

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.currentCommandId = 0;
    this.state = {
      history: [],
      inputValue: '',
    };
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const { history } = this.state;
      const updatedHistory = history.concat({
        id: this.currentCommandId++,
        value: event.target.value,
      });

      this.setState({
        history: updatedHistory,
        inputValue: '',
      });
    }
  }

  render() {
    const { history, inputValue } = this.state;
    const { inputPrompt } = this.props;
    return (
      <>
        <History history={history} />
        <Input inputPrompt={inputPrompt} handleKeyPress={this.handleKeyPress} inputValue={inputValue} />
      </>
    );
  }
}

Terminal.propTypes = {
  inputPrompt: PropTypes.string.isRequired,
};
