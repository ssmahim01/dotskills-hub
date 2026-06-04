/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import { ZodSchema } from 'zod';

interface FormErrors {
  [key: string]: string;
}

interface UseFormReturn<T> {
  formData: T;
  errors: FormErrors;
  isSubmitting: boolean;
  setFormData: (data: T | ((prev: T) => T)) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  clearField: (field: keyof T) => void;
  resetForm: (data?: T) => void;
  validateField: (field: keyof T, schema: ZodSchema) => boolean;
  validateForm: (schema: ZodSchema) => boolean;
  handleSubmit: (callback: (data: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
}

export function useForm<T extends Record<string, any>>(initialData: T): UseFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearField = useCallback((field: keyof T) => {
    setFormData((prev) => ({
      ...prev,
      [field]: initialData[field],
    }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [initialData, errors]);

  const resetForm = useCallback((data?: T) => {
    setFormData(data || initialData);
    setErrors({});
  }, [initialData]);

  const validateField = useCallback((field: keyof T, schema: ZodSchema): boolean => {
    try {
      schema.parse(formData[field]);
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
      return true;
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        setFieldError(field, error.errors[0].message);
      }
      return false;
    }
  }, [formData, errors, setFieldError]);

  const validateForm = useCallback((schema: ZodSchema): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: FormErrors = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const fieldName = err.path.join('.');
          newErrors[fieldName] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [formData]);

  const handleSubmit = useCallback(
    (callback: (data: T) => Promise<void>) => async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await callback(formData);
      } catch (error) {
        console.error('[v0] Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setFieldValue,
    setFieldError,
    clearErrors,
    clearField,
    resetForm,
    validateField,
    validateForm,
    handleSubmit,
  };
}
