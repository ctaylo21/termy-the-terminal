import React, { Component } from 'react';
import History from './History';
import Input from './Input';

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.currentCommandId = 0;
    this.state = {
      promptChar: '→',
      currentPath: '/home/user',
      history: [],
      inputValue: '',
    };
  }

  handleChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { history, inputValue } = this.state;
    const updatedHistory = history.concat({
      id: this.currentCommandId++,
      value: inputValue,
    });

    this.setState({
      history: updatedHistory,
      inputValue: '',
    });
  }

  render() {
    const {
      currentPath,
      history,
      inputValue,
      promptChar,
    } = this.state;
    return (
      <>
        <History history={history} />
        <Input
          currentPath={currentPath}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          inputValue={inputValue}
          promptChar={promptChar}
        />
      </>
    );
  }
}
