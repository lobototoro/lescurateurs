"use client";
import { useActionState, useEffect, startTransition, useRef, JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import{ z } from "zod"; 

import { articleSchema } from "@/models/articleSchema";
import { createArticleAction } from "@/app/articleActions";
import { UrlsTypes } from '@/models/article';
import ArticleMarkupForm from "@/app/components/single-elements/articleHTMLForm";
import { urlsToArrayUtil } from "@/lib/utility-functions";

/**
 * CreateArticleForm is a React component that manages the creation of an article form.
 * It handles form state, validation, submission, and various utility functions for managing URLs.
 *
 * @returns {JSX.Element} Returns an ArticleMarkupForm component with all necessary props for creating an article.
 */
export default function CreateArticleForm(): JSX.Element {
  const [state, formAction] = useActionState(createArticleAction, null);

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
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      introduction: "",
      main: "",
      mainAudioUrl: "",
      urlToMainIllustration: "",
      urls: "",
    }
  });

  register('urls');
  const urlsToArray = urlsToArrayUtil(getValues('urls'));

  const formSentModal = useRef<HTMLDivElement>(null);
  const openModal = () =>
    formSentModal.current && formSentModal.current?.classList.add('is-active'); 
  const closeModal = () => {
    if (state?.message) {
      reset();
    }
    formSentModal.current && formSentModal.current?.classList.remove('is-active');
  };

  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('introduction', data.introduction);
      formData.append('main', data.main);
      formData.append('urls', data.urls);
      formData.append('mainAudioUrl', data.mainAudioUrl || '');
      formData.append('urlToMainIllustration', data.urlToMainIllustration);
      formAction(formData);
      openModal();
    });
  };

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

  return (
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
    target="create"
  />
)};