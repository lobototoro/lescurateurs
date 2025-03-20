"use client";
import { useActionState, useEffect, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import{ z } from "zod"; 

import { articleSchema } from "@/models/articleSchema";
import { createArticleAction } from "@/app/articleActions";
import { UrlsTypes } from '@/models/article';
import ArticleMarkupForm from "@/app/components/articleHTMLForm";

export default function CreateArticleForm() {
  const [state, formAction] = useActionState(createArticleAction, null);
  
  // init for react-hook-form where we define methods that will be used and the engine for validation (zod) and the default values
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

  // urls is a special field, set in a sub sub component and instead of using a input type=hidden, we just set a register for it and a special treatment for value since it is an stringified object (sqlite doesn't support storing complex object)
  register('urls');
  const urlsToArray = getValues('urls') !== '' ? JSON.parse(getValues('urls')) : [];

  // utilities for the modal, that appears when form is sent successfully or with errors
  const formSentModal = useRef<HTMLDivElement>(null);
  const openModal = () => formSentModal.current?.classList.add('is-active'); const closeModal = () => {
    if (state?.message) {
      reset();
    }
    formSentModal.current?.classList.remove('is-active');
  };

  // onSubmit that connects useForm with server action
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

  // this useEffect aims to watch for errors while typing
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
  
  // the following 3 func are used in sub compoennts to manage adding or removing additional urls
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

    // setUrls(newUrls);
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
  />
)};