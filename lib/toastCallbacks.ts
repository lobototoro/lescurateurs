import type { ActionState } from '@/models/actionState';
import { toast } from 'sonner';

const toastCallbacks = {
  onSuccess: (result: ActionState) => {
    if (result?.message) {
      toast.success(result.message);
    }
  },
  onError: (result: ActionState) => {
    if (result?.message) {
      toast.error(result.message);
    }
  },
};

export default toastCallbacks;
