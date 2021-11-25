import React, { useState } from "react";

const useInput = (validator: (value: string) => {}) => {
    const [inputValue, setInputValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const valueIsValid = validator(inputValue);
    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setIsTouched(true);
    };

    const reset = () => {
        setInputValue('');
        setIsTouched(false);
    };

    return {
        value: inputValue,
        isValid: valueIsValid,
        hasError,
        setValue: setInputValue,
        valueChangeHandler,
        inputBlurHandler,
        reset
    };
};

export default useInput;