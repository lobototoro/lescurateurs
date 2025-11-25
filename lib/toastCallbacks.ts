import type { ActionState } from '@/models/actionState';
import { toast } from 'sonner';

const toastCallbacks = {
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

export default toastCallbacks;
