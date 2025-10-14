'use client';

import {
  JSX,
  startTransition,
  Suspense,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as R from 'ramda';

import { fetchArticleById, updateArticleAction } from '@/app/articleActions';
import { UrlsTypes } from '@/models/article';
import { articleSchema } from '@/models/articleSchema';
import ArticleMarkupForm from '@/app/components/single-elements/articleHTMLForm';
import SearchArticle from '@/app/editor/components/formComponents/searchArticle';
import { isEmpty, urlsToArrayUtil } from '@/lib/utility-functions';
import NotificationsComponent from '@/app/components/single-elements/notificationsComponent';
import { customResolver } from '../resolvers/customResolver';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

/**
 * UpdateArticleForm component for updating an existing article.
 *
 * This component provides functionality to search for an article,
 * load its details, update the article information, and submit the changes.
 * It uses React Hook Form for form management and validation.
 *
 * @returns {JSX.Element} The rendered UpdateArticleForm component
 */
export default function UpdateArticleForm({
  scrolltoTop,
}: {
  scrolltoTop: () => void;
}): JSX.Element {
  const [state, formAction, isPending] = useActionState(
    updateArticleAction,
    null
  );

  const [identicalWarnMessage, setIdenticalWarnMessage] =
    useState<boolean>(false);
  const [currentArticle, setCurrentArticle] =
    useState<z.infer<typeof articleSchema>>();
  const [selectedId, setSelectedId] = useState<string | number>();
  const [notification, setNotification] = useState<boolean>(false);

  // declaring react hook form variables with the full template of the article template
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
    resolver: customResolver(articleSchema),
    defaultValues: {
      id: 0,
      slug: '',
      title: '',
      introduction: '',
      main: '',
      published_at: '',
      created_at: '',
      updated_at: '',
      updated_by: '',
      author: '',
      author_email: '',
      validated: 'false',
      shipped: 'false',
      urls: '',
      main_audio_url: '',
      url_to_main_illustration: '',
    },
    values: currentArticle,
  });

  // can't remember why I had to register everything again: maybe to enforce using 'required' properties
  register('id', { required: true });
  register('slug', { required: true });
  register('author', { required: true });
  register('author_email', { required: true });
  register('created_at', { required: true });
  register('updated_at', { required: true });
  register('published_at', { required: true });
  register('updated_by');
  register('validated', { required: true });
  register('shipped', { required: true });

  register('main', { required: true });
  const getMaincontent = (value: string) => {
    return setValue('main', value);
  };

  // special treatment for urls added by the user
  register('urls');
  const urlsToArray = urlsToArrayUtil(getValues('urls'));

  // inline check for identical article: forbid the form to be sent to action if identical
  const checkForIdenticalArticle = (
    data: z.infer<typeof articleSchema>,
    article: z.infer<typeof articleSchema>
  ) => {
    if (R.equals(data, article)) {
      setIdenticalWarnMessage(true);
      scrolltoTop();

      return true;
    }
    if (identicalWarnMessage) {
      setIdenticalWarnMessage(false);
    }

    return false;
  };

  // main submit handler
  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    startTransition(() => {
      if (
        !checkForIdenticalArticle(
          data,
          currentArticle as z.infer<typeof articleSchema>
        ) &&
        isEmpty(errors)
      ) {
        const formData = new FormData();
        formData.append('id', data.id as unknown as string);
        formData.append('slug', data.slug as string);
        formData.append('title', data.title as string);
        formData.append('introduction', data.introduction as string);
        formData.append('main', data.main as string);
        formData.append('urls', data.urls as string);
        formData.append('main_audio_url', data.main_audio_url as string);
        formData.append(
          'url_to_main_illustration',
          data.url_to_main_illustration as string
        );
        formData.append('author', data.author as string);
        formData.append('author_email', data.author_email as string);
        formData.append('created_at', data.created_at as string);
        formData.append('updated_at', data.updated_at as string);
        formData.append('updated_by', data.updated_by as string);
        formData.append('published_at', data.published_at as string);
        formData.append('validated', data.validated as string);
        formData.append('shipped', data.shipped as string);
        formAction(formData);
      }
    });
  };

  useEffect(() => {
    // transition between search article to update to displaying selected article
    startTransition(async () => {
      if (selectedId === undefined) {
        setCurrentArticle(undefined);
        reset();

        return;
      }
      const response = await fetchArticleById(selectedId as number | bigint);

      setCurrentArticle(response?.article as z.infer<typeof articleSchema>);
    });
  }, [selectedId]);

  useEffect(() => {
    // clearing errors when addressed
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
      }
    });

    // success or failure notification
    let notifTimeout: NodeJS.Timeout | undefined;
    if (state) {
      setNotification(true);
      scrolltoTop();
      notifTimeout = setTimeout(() => {
        setSelectedId(undefined);
        setCurrentArticle(undefined);
        reset();
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

  // add urls utilities
  const initialUrls = {
    type: 'website' as UrlsTypes,
    url: '',
    credits: '',
  };

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

  // cta on the bottom of the page
  const backToSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedId(undefined);
    scrolltoTop();
  };

  return (
    <>
      <ArticleTitle
        text="Mettre à jour un article"
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
      {identicalWarnMessage && (
        <div className="notification is-warning">
          <button
            className="delete"
            onClick={() => setIdenticalWarnMessage(false)}
          ></button>
          Aucune modification n'a été apportée à l'article.
        </div>
      )}
      {isEmpty(currentArticle) ? (
        <SearchArticle
          target="update"
          setSelection={
            setSelectedId as React.Dispatch<
              React.SetStateAction<string | number>
            >
          }
        />
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <ArticleMarkupForm
            handleSubmit={handleSubmit(onSubmit)}
            register={register as any}
            errors={errors}
            urlsToArray={urlsToArray}
            updateUrls={updateUrls}
            addInputs={addInputs}
            removeInputs={removeInputs}
            target="update"
            isPending={isPending}
            getMainContent={getMaincontent}
            watch={watch}
          />
          <div className="is-flex is-justify-content-flex-end">
            <button
              className="button is-secondary is-size-6 has-text-white"
              data-testid="back-to-search"
              onClick={(event: React.MouseEvent) => backToSearch(event)}
            >
              Retour à la recherche
            </button>
          </div>
        </Suspense>
      )}
    </>
  );
}
