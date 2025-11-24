// hooks/useMainContentValidation.ts
import { useEffect } from 'react';
import {
  UseFormSubscribe,
  UseFormTrigger,
  UseFormClearErrors,
} from 'react-hook-form';

export function useMainContentValidation(
  subscribe: UseFormSubscribe<any>,
  trigger: UseFormTrigger<any>,
  clearErrors: UseFormClearErrors<any>,
  minLength: number = 50
) {
  useEffect(() => {
    const callback = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        if (!values.main || values.main.length < minLength) {
          trigger('main');
        } else {
          clearErrors('main');
        }
      },
    });

    return () => callback();
  }, [subscribe, trigger, clearErrors, minLength]);
}
