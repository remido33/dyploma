"use client";

import { FC, useState } from 'react';
import styles from '@/styles/input.module.css';
import Cta from '@/components/Cta';
import validations from '@/helpers/inputValidations';

type Props = {
    label: string,
    value?: string,
    placeholder?: string,
    onSubmit: (value: string) => void,
    ctaText?: string,
    labelAlwaysVisible?: boolean,
    hideLabel?: boolean,
}


const InputWithCta: FC<Props> =  ({ 
    label, 
    value = '', 
    placeholder = '', 
    onSubmit, 
    ctaText = 'Submit', 
    labelAlwaysVisible,
    hideLabel,
}) => {

    const [error, setError] = useState<null | string>(null);
    const [inputValue, setInputValue] = useState<string>(value);

    const handleSubmit = () => {
        const validationFn = validations[label] || validations.default;
        const error = validationFn(inputValue);
        if (error) {
            setError(error);
        } else {
            setError(null);
            onSubmit(inputValue);
        }
    };
    
    return (
        <div className={`${styles.wrapper} ${!hideLabel && styles.withLabel}`}>
            <label hidden={hideLabel || (!labelAlwaysVisible && value.length === 0)} htmlFor={label}>{label}</label>
            <div className={styles.ctas}>
                <input 
                    id={label}
                    value={inputValue}
                    placeholder={placeholder}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Cta 
                    variant="black" 
                    onClick={handleSubmit}
                >
                    {ctaText}
                </Cta>
                {error && (
                    <span className={styles.error}>{error}</span>
                )}
            </div>
        </div>
    )
};

export default InputWithCta;