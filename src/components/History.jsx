import React from 'react';
import PropTypes from 'prop-types';

function History({ history }) {
  const commandList = history.map(command => <li key={command.id}>{command.value}</li>);

  return <div id="history-container"><ul>{commandList}</ul></div>;
}

History.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

History.defaultProps = {
  history: [],
};

export default History;
