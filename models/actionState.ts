import { User } from './user';
import { Article } from './article';
import type { Slugs } from './slugs';

export type ActionState =
  | {
      message: string;
      status: number | Record<string, unknown> | undefined;
      isSuccess: boolean;
    }
  | null // initial state
  | undefined; // if server action does not return anything

export type TSearchResponse =
  | {
      isSuccess: true;
      article?: Article | Article[];
      slugs?: Slugs[];
      usersList?: User[];
    }
  | {
      isSuccess: false;
      message: string;
    };
