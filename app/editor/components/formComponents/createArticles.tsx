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
import { UrlsTypes } from '@/models/article';
import ArticleMarkupForm from '@/app/components/single-elements/articleHTMLForm';
import { urlsToArrayUtil } from '@/lib/utility-functions';
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
  scrolltoTop,
}: {
  scrolltoTop: () => void;
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
    clearErrors,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof articleSchema>>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: customResolver(articleSchema) as any,
    defaultValues: {
      title: '',
      introduction: '',
      main: '',
      main_audio_url: '',
      url_to_main_illustration: '',
      urls: '',
    },
  });

  // registering urls that need a special treatment
  register('main', { required: true });
  const getMaincontent = (value: string) => {
    return setValue('main', value);
  };

  // adding, removing and updating those fields are handled by the urlsToArrayUtil function
  register('urls');
  const urlsToArray = urlsToArrayUtil(getValues('urls'));

  // main function that submits data to the server action part
  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    startTransition(() => {
      formAction(data);
    });
  };

  // reset function specifically made for rte
  const resetAllfields = () => {};

  useEffect(() => {
    // utility that helps clear errors when addressed live by the user
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
      }
    });

    // display of the final notification, on success or failure
    let notifTimeout: NodeJS.Timeout | undefined;
    if (state) {
      setNotification(true);
      scrolltoTop();
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
      subscription.unsubscribe();
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [watch, clearErrors, state]);

  // template for urls, injected when a url field is added
  const initialUrls = {
    type: 'website' as UrlsTypes,
    url: '',
    credits: '',
  };

  // utilities for urls fields
  const addInputs = () => {
    const urls = urlsToArray;
    setValue('urls', JSON.stringify([...urls, initialUrls]));
  };
  const removeInputs = () => {
    if (urlsToArray.length > 1) {
      setValue('urls', JSON.stringify(urlsToArray.slice(0, -1)));
    }
  };
  const updateUrls = (
    newUrl: { type: UrlsTypes; url: string; credits?: string },
    index: number
  ) => {
    const newUrls = urlsToArray;
    newUrls[index] = newUrl;
    setValue('urls', JSON.stringify(newUrls));
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
