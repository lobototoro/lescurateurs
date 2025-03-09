"use client";
import { useState, useActionState, useRef } from "react";

import { createArticleAction } from "@/app/articleActions";
import { AddUrlsObjects } from "./addUrlsObjects";
import { UrlsTypes } from '@/models/article';
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";

export default function CreateArticleForm() {
  const [state, formAction, isPending] = useActionState(createArticleAction, null);
  const [urls, setUrls] = useState<{ type: UrlsTypes; url: string; credits?: string }[]>([]);
  const hiddenRef = useRef<HTMLInputElement>(null);

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
  
  return (
    <form action={formAction}>
      {isPending && <p className="is-loading">Loading...</p>}
      {state && <p>{state.text}</p>}
      <div className="mt-6">
        <div className="field">
        <label className="label" aria-label="label du champ Titre">Titre</label>
        <div className="control">
          <input className="input" type="text" placeholder="titre" name="title" />
        </div>
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ introduction">introduction</label>
        <textarea className="textarea" placeholder="introduction" name="introduction" rows={5}></textarea>
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ Texte">Texte</label>
        <textarea className="textarea" placeholder="Texte" name="main" rows={10}></textarea>
      </div>

      <div className="field">
        <label className="label" aria-label="label du champ lien audio principal">lien audio principal</label>
        <div className="control">
          <input className="input" type="url" placeholder="lien audio" name="mainAudioUrl" />
        </div>
      </div>

      <div className="field">
        <label className="label is-inline-flex" aria-label="label du champ lien vers l'illustration">lien vers l'illustration</label>
        <div className="control">
          <input className="input" type="url" placeholder="lien vers l'illustration" name="urlToMainIllustration" />
        </div>
      </div>
      <ArticleTitle
        text="Ajouter des liens multimédias"
        level="h4"
        size="medium"
        color="white"
        spacings="mt-5 mb-4"
      />
      <input type="hidden" ref={hiddenRef} name="urls" value={JSON.stringify(urls)} />
      <AddUrlsObjects
        urls={urls}
        updateUrls={updateUrls}
        addInputs={addInputs}
        removeInputs={removeInputs}
      />
    </div>
    <div className="field mt-5">
      <input type="submit" className="button is-primary is-size-6 has-text-white" value="Valider" />
    </div>
  </form>
)};