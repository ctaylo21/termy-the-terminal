import React from 'react';

interface IProps {
  path: string;
  promptChar: string;
}

export const InputPrompt: React.FC<IProps> = props => {
  const { path, promptChar } = props;

  return (
    <>
      <span id="inputPromptPath">{path}</span>
      &nbsp;
      <span id="inputPromptChar">{promptChar}</span>
    </>
  );
};
