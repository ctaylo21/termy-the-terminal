import React from 'react';

interface InputPromptProps {
  path: string;
  promptChar: string;
}

export const InputPrompt: React.FC<InputPromptProps> = (props): JSX.Element => {
  const { path, promptChar } = props;

  return (
    <>
      <span id="inputPromptPath">{path}</span>
      &nbsp;
      <span id="inputPromptChar">{promptChar}</span>
    </>
  );
};
