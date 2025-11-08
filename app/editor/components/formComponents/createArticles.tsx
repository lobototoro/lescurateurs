'use client';
import {
  useActionState,
  useEffect,
  startTransition,
  JSX,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { articleSchema } from '@/models/articleSchema';
import { createArticleAction } from '@/app/articleActions';
import ArticleMarkupForm from '@/app/components/single-elements/articleHTMLForm';
import { addRemoveInputsFactory } from '@/lib/utility-functions';
import NotificationsComponent from '@/app/components/single-elements/notificationsComponent';
import { customResolver } from '@/app/editor/components/resolvers/customResolver';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

/**
 * CreateArticleForm is a React component that manages the creation of an article form.
 * It handles form state, validation, submission, and various utility functions for managing URLs.
 *
 * @returns {JSX.Element} Returns an ArticleMarkupForm component with all necessary props for creating an article.
 */
export default function CreateArticleForm({
  scrollTopAction,
}: {
  scrollTopAction: () => void;
}): JSX.Element {
  const [state, formAction, isPending] = useActionState(
    createArticleAction,
    null
  );
  const [notification, setNotification] = useState<boolean>(false);

  // declaring react hook form variables
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { dirtyFields, touchedFields, errors },
  } = useForm<z.infer<typeof articleSchema>>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: customResolver(articleSchema) as any,

    /* minimum values to create an article */
    defaultValues: {
      title: '',
      introduction: '',
      main: '',
      main_audio_url: '',
      url_to_main_illustration: '',
      urls: [],
    },
  });

  // registering urls that need a special treatment
  register('main', { required: true });
  const getMaincontent = (value: string) => {
    return setValue('main', value);
  };

  // adding, removing and updating those fields are handled here
  register('urls');
  const urlsToArray: any = getValues('urls');
  const [addInputs, removeInputs, updateUrls] = addRemoveInputsFactory(
    urlsToArray,
    setValue
  );

  // main function that submits data to the server action part
  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    startTransition(() => {
      formAction(data);
    });
  };

  useEffect(() => {
    // display of the final notification, on success or failure
    let notifTimeout: NodeJS.Timeout | undefined;
    if (state) {
      setNotification(true);
      scrollTopAction();
      notifTimeout = setTimeout(() => {
        if (state?.message) {
          // NEX-65 in case of error, we don't reset the form
          // NEX-65
          reset();
        }
        setNotification(false);
      }, 6000);
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [state]);

  console.info('main ', touchedFields, dirtyFields);

  return (
    <>
      <ArticleTitle
        text="Créer un article"
        level="h2"
        size="large"
        color="white"
        spacings="mt-6 mb-4"
      />
      {notification && (
        <NotificationsComponent
          state={state as { message: boolean; text: string }}
        />
      )}
      <ArticleMarkupForm
        handleSubmit={handleSubmit(onSubmit)}
        register={register as any}
        errors={errors}
        urlsToArray={urlsToArray}
        updateUrls={updateUrls}
        addInputs={addInputs}
        removeInputs={removeInputs}
        target="create"
        isPending={isPending}
        getMainContent={getMaincontent}
        watch={watch}
      />
    </>
  );
}
