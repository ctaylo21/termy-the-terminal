import React, { ChangeEvent, FormEvent } from 'react';
import { InputPrompt } from './InputPrompt';

interface IProps {
  currentPath: string;
  inputValue: string;
  promptChar: string;
  handleChange(event: ChangeEvent<HTMLInputElement>): void;
  handleSubmit(event: FormEvent<HTMLFormElement>): void;
}

export const Input: React.FC<IProps> = props => {
  const {
    currentPath,
    handleChange,
    handleSubmit,
    inputValue,
    promptChar,
  } = props;
  return (
    <div id="input-container">
      <form onSubmit={handleSubmit}>
        <InputPrompt path={currentPath} promptChar={promptChar} />
        <input type="text" value={inputValue} onChange={handleChange} />
      </form>
    </div>
  );
};

export default Input;