"use client";

import { JSX, startTransition, Suspense, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import{ z } from "zod";
import * as R from "ramda";

import { fetchArticleById, updateArticleAction } from "@/app/articleActions";
import { UrlsTypes } from "@/models/article";
import { articleSchema } from "@/models/articleSchema";
import ArticleMarkupForm from "@/app/components/articleHTMLForm";
import SearchArticle from "@/app/editor/components/formComponents/searchArticle";
import { isEmpty, urlsToArrayUtil } from "@/lib/utility-functions";

/**
 * UpdateArticleForm component for updating an existing article.
 * 
 * This component provides functionality to search for an article,
 * load its details, update the article information, and submit the changes.
 * It uses React Hook Form for form management and validation.
 * 
 * @returns {JSX.Element} The rendered UpdateArticleForm component
 */
export default function UpdateArticleForm(): JSX.Element {
  const [state, formAction] = useActionState(updateArticleAction, null);

  const [currentArticle, setCurrentArticle] = useState<z.infer<typeof articleSchema>>();
  const [selectedId, setSelectedId] = useState<string | number>();

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      id: 0,
      slug: "",
      title: "",
      introduction: "",
      main: "",
      publishedAt: "",
      createdAt: "",
      updatedAt: "",
      author: "",
      author_email: "",
      validated: 'false',
      shipped: 'false',
      urls: "",
      mainAudioUrl: "",
      urlToMainIllustration: "",
    },
    values: currentArticle
  });

  register('id', { required: true });
  register('slug', { required: true });
  register('author', { required: true });
  register('author_email', { required: true });
  register('createdAt', { required: true });
  register('updatedAt', { required: true });
  register('publishedAt', { required: true });
  register('validated', { required: true });
  register('shipped', { required: true });

  register('urls');
  const urlsToArray = urlsToArrayUtil(getValues('urls'));

  const formSentModal = useRef<HTMLDivElement>(null);
  const openModal = () =>
    formSentModal.current && formSentModal.current?.classList.add('is-active');
  const closeModal = () => {
    if (state?.message) {
      setSelectedId(undefined);
      setCurrentArticle(undefined);
      reset();
    }
    formSentModal.current &&
      formSentModal.current?.classList.remove('is-active');
  }

  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    startTransition(() => {
      if (R.equals(data, currentArticle) && isEmpty(errors)  ) {
        setError('root.random', {
          type: "error",
          message: ": aucun changement dans les données.",
        });
        setTimeout(() => { // find a way to clear this on menu change or page unmount
          clearErrors('root.random');
        }, 2400);

        return;
      }
      const formData = new FormData();
      formData.append('id', data.id as unknown as string);
      formData.append('slug', data.slug as string);
      formData.append('title', data.title as string);
      formData.append('introduction', data.introduction as string);
      formData.append('main', data.main as string);
      formData.append('urls', data.urls as string);
      formData.append('mainAudioUrl', data.mainAudioUrl as string);
      formData.append('urlToMainIllustration', data.urlToMainIllustration as string);
      formData.append('author', data.author as string);
      formData.append('author_email', data.author_email as string);
      formData.append('createdAt', data.createdAt as string);
      formData.append('updatedAt', data.updatedAt as string);
      formData.append('publishedAt', data.publishedAt as string);
      formData.append('validated', data.validated as string);
      formData.append('shipped', data.shipped as string);
      formAction(formData);
      openModal();
    });
  };

  useEffect(() => {
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
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  const initialUrls = {
      type: 'website' as UrlsTypes,
      url: '',
      credits: '',
  };

  const addInputs = () => {
    const urls = urlsToArray;
    setValue('urls', JSON.stringify([...urls, initialUrls]));
  }
  const removeInputs = () => {
    if (urlsToArray.length > 1) {
      setValue('urls', JSON.stringify(urlsToArray.slice(0, -1)));
    }
  }

  const updateUrls = (newUrl: { type: UrlsTypes; url: string; credits?: string }, index: number) => {
    const newUrls = urlsToArray;
    newUrls[index] = newUrl;
    setValue('urls', JSON.stringify(newUrls));
  };

  const backToSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedId(undefined);
  };

  return (
    <>
      {isEmpty(currentArticle) ? (
        <SearchArticle
          target="update"
          setSelection={setSelectedId as React.Dispatch<React.SetStateAction<string | number>>}
        />
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <ArticleMarkupForm
            handleSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            urlsToArray={urlsToArray}
            updateUrls={updateUrls}
            addInputs={addInputs}
            removeInputs={removeInputs}
            formSentModal={formSentModal as React.RefObject<HTMLDivElement>}
            state={state}
            closeModal={closeModal}
            target="update"
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
