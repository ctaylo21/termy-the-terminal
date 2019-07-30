import React, { ChangeEvent, FormEvent } from 'react';
interface InputProps {
    currentPath: string;
    inputValue: string;
    promptChar: string;
    handleChange?(event: ChangeEvent<HTMLInputElement>): void;
    handleSubmit?(event: FormEvent<HTMLFormElement>): void;
    readOnly: boolean;
}
export declare const Input: React.FC<InputProps>;
export default Input;
