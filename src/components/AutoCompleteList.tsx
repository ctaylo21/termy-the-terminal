import React from 'react';

export interface AutoCompleteList {
  [index: string]: {
    type: 'FOLDER' | 'FILE';
  };
}

interface AutoCompleteListProps {
  items: AutoCompleteList;
  activeItemIndex?: number;
}

const AutoCompleteList: React.FC<AutoCompleteListProps> = (
  props,
): JSX.Element => {
  const { items, activeItemIndex } = props;

  const autoCompleteItems = Object.keys(items).map(
    (key, index): JSX.Element => {
      if (items[key].type === 'FOLDER') {
        return (
          <span
            className={
              activeItemIndex === index
                ? 'ls-preview-folder active'
                : 'ls-preview-folder'
            }
            key={key}
          >
            {key}/
          </span>
        );
      }

      return (
        <span
          className={
            activeItemIndex === index
              ? 'ls-preview-file active'
              : 'ls-preview-file'
          }
          key={key}
        >
          {key}
        </span>
      );
    },
  );

  return <div className="preview-list">{autoCompleteItems}</div>;
};

export default AutoCompleteList;
