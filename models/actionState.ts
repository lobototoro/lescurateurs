export type ActionState =
  | {
      message: string;
      status: number | Record<string, unknown> | undefined;
      isSuccess: boolean;
    }
  | null // initial state
  | undefined; // if server action does not return anything
