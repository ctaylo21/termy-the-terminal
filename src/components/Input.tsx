import React, { ChangeEvent, FormEvent } from 'react';
import { InputPrompt } from './InputPrompt';

interface InputProps {
  currentPath: string;
  inputValue: string;
  inputPrompt: string;
  handleChange?(event: ChangeEvent<HTMLInputElement>): void;
  handleSubmit?(event: FormEvent<HTMLFormElement>): void;
  readOnly: boolean;
}

export const Input: React.FC<InputProps> = (props): JSX.Element => {
  const {
    currentPath,
    handleChange,
    handleSubmit,
    inputValue,
    inputPrompt,
    readOnly,
  } = props;

  return (
    <div id="input-container" spellCheck={false}>
      <form onSubmit={handleSubmit}>
        <InputPrompt path={currentPath} inputPrompt={inputPrompt} />
        <input
          aria-label="terminal-input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </form>
    </div>
  );
};

export default Input;
