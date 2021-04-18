import React, { ChangeEvent, FormEvent, KeyboardEvent, RefObject } from 'react';
import { InputPrompt } from './InputPrompt';

interface InputProps {
  currentPath: string;
  inputValue: string;
  inputPrompt: string;
  handleChange?(event: ChangeEvent<HTMLInputElement>): void;
  handleKeyDown?(event: KeyboardEvent<HTMLInputElement>): void;
  handleKeyUp?(event: KeyboardEvent<HTMLInputElement>): void;
  handleSubmit?(event: FormEvent<HTMLFormElement>): void;
  readOnly: boolean;
  ref?: RefObject<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref): JSX.Element {
    const {
      currentPath,
      handleChange,
      handleKeyDown,
      handleKeyUp,
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
            autoComplete="none"
            autoCapitalize="none"
            autoCorrect="off"
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            readOnly={readOnly}
            ref={ref}
          />
        </form>
      </div>
    );
  },
);

export default Input;
