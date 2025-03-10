"use client";
import { useActionState, startTransition, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import{ isValid, z } from "zod"; 

import { isEmpty } from "@/lib/isEmpty";
import { articleSchema } from "@/models/articleSchema";
import { createArticleAction } from "@/app/articleActions";
import { AddUrlsObjects } from "./addUrlsObjects";
import { UrlsTypes } from '@/models/article';
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";

export default function CreateArticleForm() {
  const [state, formAction, isPending] = useActionState(createArticleAction, null);
  
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

  const onSubmit = useCallback((data: z.infer<typeof articleSchema>) => {

    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('introduction', data.introduction);
      formData.append('main', data.main);
      formData.append('urls', data.urls);
      formData.append('mainAudioUrl', data.mainAudioUrl || '');
      formData.append('urlToMainIllustration', data.urlToMainIllustration);
      await formAction(formData);
    });
  }, [formAction]);

  // this useEffect aims to watch for errors while typing
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
      }
    });
    if (state?.message) {
      reset();
    }

    return () => subscription.unsubscribe();
  }, [watch, clearErrors, state, reset]);

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
    <form onSubmit={handleSubmit(onSubmit)}>
      { state && <p className="has-text-success">{state.text}</p>}
      <div className="mt-6">
        <div className="field">
        <label className="label" aria-label="label du champ Titre" htmlFor="title">Titre</label>
        <div className="field">
          <input className="input" type="text" {...register('title')} />
        </div>
        { errors.title && <p className="has-text-danger">{errors.title.message}</p>}
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ introduction" htmlFor="introduction">introduction</label>
        <textarea className="textarea" {...register('introduction')} rows={5}></textarea>
        { errors.introduction && <p className="has-text-danger">{errors.introduction.message}</p>}
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ Texte" htmlFor="main">Texte</label>
        <textarea className="textarea" {...register('main')} rows={10}></textarea>
        { errors.main && <p className="has-text-danger">{errors.main.message}</p>}
      </div>

      <div className="field">
        <label className="label is-inline-flex" aria-label="label du champ lien vers l'illustration" htmlFor="urlToMainIllustration">lien vers l'illustration</label>
        <div className="control">
          <input className="input" type="url" {...register('urlToMainIllustration')} />
        </div>
        { errors.urlToMainIllustration && <p className="has-text-danger">{errors.urlToMainIllustration.message}</p>}
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ lien audio principal" htmlFor="mainAudioUrl">lien audio principal</label>
        <div className="control">
          <input className="input" type="url" {...register('mainAudioUrl')} />
        </div>
        { errors.mainAudioUrl && <p className="has-text-danger">{errors.mainAudioUrl.message}</p>}
      </div>

      <ArticleTitle
        text="Ajouter des liens multimédias"
        level="h4"
        size="medium"
        color="white"
        spacings="mt-5 mb-4"
      />
      { errors.urls && <p className="has-text-danger">{errors.urls.message}</p>}
      <AddUrlsObjects
        urls={urlsToArray}
        updateUrls={updateUrls}
        addInputs={addInputs}
        removeInputs={removeInputs}
      />
    </div>
    
    { !isEmpty(errors) && <p className="has-text-danger">Des erreurs existent dans le formulaire</p>}
    { state && <p className="mt-5 has-text-success">{state.text}</p>}
    <div className="field mt-5">
      <input type="submit" className="button is-primary is-size-6 has-text-white" value="Valider" disabled={!isValid || isPending} />
    </div>
  </form>
)};