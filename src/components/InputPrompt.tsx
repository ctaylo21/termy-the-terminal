import React from 'react';

interface InputPromptProps {
  path: string;
  promptChar: string;
}

export const InputPrompt: React.FC<InputPromptProps> = (props): JSX.Element => {
  const { path, promptChar } = props;

  return (
    <>
      <span data-testid="input-prompt-path">{path}</span>
      &nbsp;
      <span id="inputPromptChar">{promptChar}</span>
    </>
  );
};
