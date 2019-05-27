import React from 'react';
import FolderIcon from '-!svg-react-loader!../images/folder.svg';
import FileIcon from '-!svg-react-loader!../images/file.svg';

interface LsResultProps {
  lsResult: LsResultType;
}

const LsResult: React.FC<LsResultProps> = (props): JSX.Element => {
  const { lsResult } = props;

  const lsItems = Object.keys(lsResult).map(
    (key): JSX.Element => {
      console.log(FolderIcon);
      if (lsResult[key].type === 'FOLDER') {
        return (
          <li className="ls-folder" key={key}>
            <FolderIcon /> {key}
          </li>
        );
      }

      return (
        <li className="ls-file" key={key}>
          <FileIcon /> {key}
        </li>
      );
    },
  );

  return <ul className="terminal-ls-list">{lsItems}</ul>;
};

export default LsResult;
