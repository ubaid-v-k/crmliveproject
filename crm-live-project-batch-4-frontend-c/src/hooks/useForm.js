import { useState, useCallback } from "react";

/**
 * Custom hook for form handling with validation.
 *
 * @param {object} initialValues - Initial state of the form
 * @param {boolean} validateOnChange - If true, validates on every change
 * @param {function} validate - Validation function returning errors object
 */
export function useForm(initialValues, validateOnChange = false, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));

        if (validateOnChange && validate) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors(validationErrors);
        }
    }, [validateOnChange, validate, values]);

    const handleSelectChange = useCallback((name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        if (validateOnChange && validate) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors(validationErrors);
        }
    }, [validateOnChange, validate, values]);

    // For Multi-select or special inputs
    const setFieldValue = useCallback((name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        if (validateOnChange && validate) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors(validationErrors);
        }
    }, [validateOnChange, validate, values]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    const handleSubmit = (callback) => (e) => {
        if (e) e.preventDefault();

        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                callback(values);
            }
        } else {
            callback(values);
        }
    };

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleChange,
        handleSelectChange,
        setFieldValue,
        resetForm,
        handleSubmit,
    };
}
