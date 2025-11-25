export type ActionState =
  | {
      message: string;
      status: any;
      isSuccess: boolean;
    }
  | null // initial state
  | undefined; // if server action does not return anything
