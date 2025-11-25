import type { ActionState } from '@/models/actionState';

export const toActionState = (
  message: string,
  status: any,
  isSuccess: boolean
): ActionState => {
  return { message, status, isSuccess };
};
