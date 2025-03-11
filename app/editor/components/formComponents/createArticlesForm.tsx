"use client";
import { useActionState, useEffect, startTransition, useRef } from "react";
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6">
        <div className="field">
        <label className="label" aria-label="label du champ Titre" htmlFor="title">Titre</label>
        <div className="field">
          <input className="input" type="text" {...register('title')} data-testid="title" required />
        </div>
        { errors.title && <p className="has-text-danger">{errors.title.message}</p>}
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ introduction" htmlFor="introduction">introduction</label>
        <textarea className="textarea" {...register('introduction')} rows={5} data-testid="introduction" required></textarea>
        { errors.introduction && <p className="has-text-danger">{errors.introduction.message}</p>}
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ Texte" htmlFor="main">Texte</label>
        <textarea className="textarea" {...register('main')} rows={10} data-testid="main" required></textarea>
        { errors.main && <p className="has-text-danger">{errors.main.message}</p>}
      </div>

      <div className="field">
        <label className="label is-inline-flex" aria-label="label du champ lien vers l'illustration" htmlFor="urlToMainIllustration">lien vers l'illustration</label>
        <div className="control">
          <input className="input" type="url" {...register('urlToMainIllustration')} data-testid="urlToMainIllustration" required />
        </div>
        { errors.urlToMainIllustration && <p className="has-text-danger">{errors.urlToMainIllustration.message}</p>}
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ lien audio principal" htmlFor="mainAudioUrl">lien audio principal</label>
        <div className="control">
          <input className="input" type="url" {...register('mainAudioUrl')} data-testid="mainAudioUrl" required />
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
    
    <div className="modal" ref={formSentModal} data-testid="create-article-modal">
      <div className="modal-background"></div>
      <div className={state?.message ? 'modal-content is-success' : 'modal-content is-danger'}>
        <p className="is-size-6 has-text-white has-background-primary p-6">{state?.text}</p>
        <button className="modal-close is-large" aria-label="close modal" onClick={() => closeModal()}></button>
      </div>
    </div>

    <div className="field mt-5">
      <input type="submit" className="button is-primary is-size-6 has-text-white" value="Valider" data-testid="submit" disabled={!isEmpty(errors)} />
    </div>
  </form>
)};