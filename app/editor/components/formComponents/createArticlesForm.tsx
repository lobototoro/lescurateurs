"use client";
import { useState, useActionState, startTransition, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import{ z } from "zod"; 

import { isEmpty } from "@/lib/isEmpty";
import { articleSchema } from "@/models/articleSchema";
import { createArticleAction } from "@/app/articleActions";
import { AddUrlsObjects } from "./addUrlsObjects";
import { UrlsTypes } from '@/models/article';
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";

export default function CreateArticleForm() {
  const [state, formAction, isPending] = useActionState(createArticleAction, null);
  const [urls, setUrls] = useState<{ type: UrlsTypes; url: string; credits?: string }[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      introduction: "",
      main: "",
      urls: "",
      mainAudioUrl: "",
      urlToMainIllustration: "",
    }
  });

  const onSubmit = useCallback((data: z.infer<typeof articleSchema>) => {
    console.log('in create article DATA ', data);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('introduction', data.introduction);
      formData.append('main', data.main);
      formData.append('urls', data.urls);
      formData.append('mainAudioUrl', data.mainAudioUrl || '');
      formData.append('urlToMainIllustration', data.urlToMainIllustration);
      const submit = await formAction(formData);
      console.log('in create article form', submit);
    });
  }, [formAction]);

  useEffect(() => {
    console.info('in create article form useEffect', urls);
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors, urls]);

  const initialUrls = {
      type: 'website' as UrlsTypes,
      url: '',
      credits: '',
  };
  
  const addInputs = () => {
    setUrls([...urls, initialUrls]);
  }
  const removeInputs = () => {
    if (urls.length > 1) {
      setUrls(urls.slice(0, -1));
    }
  }

  const updateUrls = (newUrl: { type: UrlsTypes; url: string; credits?: string }, index: number) => {
    const newUrls = [...urls];
    newUrls[index] = newUrl;
    setUrls(newUrls);
  };
  console.log('in create article form:erros ', errors)
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isPending && <p className="is-loading">Loading...</p>}
      {state && <p>{state.text}</p>}
      <div className="mt-6">
        <div className="field">
        <label className="label" aria-label="label du champ Titre" htmlFor="title">Titre</label>
        <div className="control">
          <input className="input" type="text" {...register('title')} />
        </div>
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ introduction" htmlFor="introduction">introduction</label>
        <textarea className="textarea" {...register('introduction')} rows={5}></textarea>
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ Texte" htmlFor="main">Texte</label>
        <textarea className="textarea" {...register('main')} rows={10}></textarea>
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ lien audio principal" htmlFor="mainAudioUrl">lien audio principal</label>
        <div className="control">
          <input className="input" type="url" {...register('mainAudioUrl')} />
        </div>
      </div>

      <div className="field">
        <label className="label is-inline-flex" aria-label="label du champ lien vers l'illustration" htmlFor="urlToMainIllustration">lien vers l'illustration</label>
        <div className="control">
          <input className="input" type="url" {...register('urlToMainIllustration')} />
        </div>
      </div>
      <ArticleTitle
        text="Ajouter des liens multimédias"
        level="h4"
        size="medium"
        color="white"
        spacings="mt-5 mb-4"
      />
      <input type="hidden" {...register('urls')} />
      <AddUrlsObjects
        urls={urls}
        updateUrls={updateUrls}
        addInputs={addInputs}
        removeInputs={removeInputs}
      />
    </div>
    { errors.urls && <p className="has-text-danger">{errors.urls.message}</p>}
    { errors.title && <p className="has-text-danger">{errors.title.message}</p>}
    { errors.introduction && <p className="has-text-danger">{errors.introduction.message}</p>}
    { errors.main && <p className="has-text-danger">{errors.main.message}</p>}
    { errors.mainAudioUrl && <p className="has-text-danger">{errors.mainAudioUrl.message}</p>}
    { errors.urlToMainIllustration && <p className="has-text-danger">{errors.urlToMainIllustration.message}</p>}
    { !isEmpty(errors) && <p className="help has-text-danger">Des erreurs existent dans le formulaire</p>}
    <div className="field mt-5">
      <input type="submit" className="button is-primary is-size-6 has-text-white" value="Valider" />
    </div>
  </form>
)};