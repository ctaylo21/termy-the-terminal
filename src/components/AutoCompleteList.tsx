import React from 'react';

export interface AutoCompleteList {
  [index: string]: {
    type: 'FOLDER' | 'FILE';
  };
}

interface AutoCompleteListProps {
  items: AutoCompleteList;
}

const AutoCompleteList: React.FC<AutoCompleteListProps> = (
  props,
): JSX.Element => {
  const { items } = props;

  const autoCompleteItems = Object.keys(items).map(
    (key): JSX.Element => {
      if (items[key].type === 'FOLDER') {
        return (
          <span className="ls-preview-folder" key={key}>
            {key}/
          </span>
        );
      }

      return (
        <span className="ls-preview-file" key={key}>
          {key}
        </span>
      );
    },
  );

  return <div className="preview-list">{autoCompleteItems}</div>;
};

export default AutoCompleteList;
