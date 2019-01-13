import React, { Component } from 'react';
import History from './History';
import Input from './Input';

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.currentCommandId = 0;
    this.state = {
      history: [],
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
      });
    }
  }

  render() {
    const { history } = this.state;
    return (
      <>
        <History history={history} />
        <Input handleKeyPress={this.handleKeyPress} />
      </>
    );
  }
}
