import type { ActionState } from '@/models/actionState';

import { toast } from 'sonner';

/**
 * @packageDocumentation
 * Utilities for composing async UI actions that return an ActionState with success/error callbacks
 * and toast notifications.
 *
 * The core utility is withCallbacks, which:
 * - Executes an async function that resolves to an ActionState.
 * - Invokes onSuccess/onError based on result.isSuccess.
 * - Invokes an optional postSubmit function after completion (regardless of success).
 * - Returns the original promise from the wrapped function so callers can await the same result.
 *
 * Included defaults:
 * - toastCallbacks: Preconfigured callbacks that display success/error toasts via the "sonner" library.
 * - toActionState: Helper for constructing an ActionState object from discrete values.
 *
 * @see withCallbacks
 * @see toastCallbacks
 * @see toActionState
 * @see Callbacks
 * @see PostSubmit
 *
 * @example
 * // Basic usage
 * import { withCallbacks, toastCallbacks } from './path';
 *
 * async function saveUser(data: FormData): Promise<ActionState> {
 *   // ...perform save
 *   return { isSuccess: true, message: 'User saved', status: 200 };
 * }
 *
 * const submit = withCallbacks(saveUser, toastCallbacks);
 * await submit(formData);
 *
 * @example
 * // Custom callbacks and post-submit behavior
 * const submit = withCallbacks(
 *   saveUser,
 *   {
 *     onSuccess: (res) => console.log('Saved:', res),
 *     onError: (res) => console.error('Failed:', res),
 *   },
 *   () => console.log('Finished submit')
 * );
 */

type Callbacks<T> = {
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

type PostSubmit = () => void | undefined;

export const withCallbacks = <Args extends unknown[], T extends ActionState>(
  fn: (...args: Args) => Promise<T>,
  callbacks: Callbacks<T>,
  postSubmitFunction?: PostSubmit
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args) => {
    const promise = fn(...args);

    const result = await promise;

    if (result?.isSuccess) {
      callbacks.onSuccess?.(result);
    }

    if (!result?.isSuccess) {
      callbacks.onError?.(result);
    }
    if (postSubmitFunction) {
      postSubmitFunction();
    }

    return promise;
  };
};

export const toastCallbacks = {
  onSuccess: (result: ActionState) => {
    if (result?.message) {
      toast.success(result.message, {
        style: {
          background: 'green',
        },
      });
    }
  },
  onError: (result: ActionState) => {
    if (result?.message) {
      toast.error(result.message, {
        style: {
          background: 'red',
        },
      });
    }
  },
};

export const toActionState = (
  message: string,
  status: any,
  isSuccess: boolean
): ActionState => {
  return { message, status, isSuccess };
};
