'use client';
import React, { useActionState, startTransition } from 'react';
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
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(
    createArticleAction,
    null
  );

  // declaring react hook form variables
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
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
  const urlsToArray = getValues('urls');
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

  return (
    <>
      <ArticleTitle
        text="Créer un article"
        level="h2"
        size="large"
        color="white"
        spacings="mt-6 mb-4"
      />
      {state && (
        <NotificationsComponent
          notificationAction={state as { message: boolean; text: string }}
          performClosingActions={reset}
          toTop={scrollTopAction}
        />
      )}
      <ArticleMarkupForm
        handleSubmit={handleSubmit(onSubmit)}
        register={register as any}
        errors={errors}
        urlsToArray={urlsToArray as any[]}
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
