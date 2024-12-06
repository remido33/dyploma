"use client";
import { CSSProperties, FC, useState } from 'react';
import styles from '@/styles/input.module.css';
import validations from '@/helpers/inputValidations';

type Props = {
    label: string,
    value: string,
    setValue: (value: string, error: string | null) => void,
    placeholder?: string,
    style?: CSSProperties,
    labelAlwaysVisible?: boolean,
    hideLabel?: boolean,
};

const Input: FC<Props> = ({ 
    label,
    value = '', 
    setValue, 
    placeholder = '',
    style,
    labelAlwaysVisible,
    hideLabel,
}) => {
    
    const [error, setError] = useState<null | string>(null);
    
    const onChange = (inputValue: string) => {
        const validationFn = validations[label] || validations.default;
        const error = validationFn(inputValue);
        setValue(inputValue, error)
        setError(error);
    };

    return (
        <div className={`${styles.wrapper} ${!hideLabel && styles.withLabel}`}>
            <label hidden={hideLabel || (!labelAlwaysVisible && value.length === 0)} htmlFor={label}>{label}</label>
            <input 
                id={label} 
                value={value} 
                placeholder={placeholder} 
                style={style}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && (
                <span className={styles.error}>{error}</span>
            )}
        </div>
    )
};

export default Input;