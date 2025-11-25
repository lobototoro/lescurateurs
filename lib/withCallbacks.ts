// src/features/user/user-item.tsx
import type { ActionState } from '@/models/actionState';

type Callbacks<T> = {
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

type PostSubmit = () => void | undefined;

const withCallbacks = <Args extends unknown[], T extends ActionState>(
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

export default withCallbacks;
