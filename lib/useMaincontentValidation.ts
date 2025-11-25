// hooks/useMainContentValidation.ts
import { useEffect } from 'react';
import {
  UseFormWatch,
  UseFormTrigger,
  UseFormClearErrors,
} from 'react-hook-form';

export function useMainContentValidation(
  propName: string,
  watch: UseFormWatch<any>,
  trigger: UseFormTrigger<any>,
  clearErrors: UseFormClearErrors<any>,
  minLength: number = 50
) {
  useEffect(() => {
    const subscription = watch((data) => {
      if (data[propName] && data[propName].length < minLength) {
        trigger(propName);
      } else {
        clearErrors(propName);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);
}
