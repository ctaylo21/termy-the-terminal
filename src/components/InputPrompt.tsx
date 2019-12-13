import React from 'react';

interface InputPromptProps {
  path: string;
  inputPrompt: string;
}

export const InputPrompt: React.FC<InputPromptProps> = (props): JSX.Element => {
  const { path, inputPrompt } = props;

  return (
    <>
      <span data-testid="input-prompt-path">{path}</span>
      &nbsp;
      <span id="inputPrompt">{inputPrompt}</span>
    </>
  );
};
