"use client";
import React from "react";

import { AddUrlsObjects } from "./addUrlsObjects";

// import { UrlObjectIterator } from "./urlObjectIter";
import { UrlsTypes } from '@/models/article';
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";

export default function CreatearticlesForm() {
  const [urls, setUrls] = React.useState<{ type: UrlsTypes; url: string; credits?: string }[]>([]);

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
  
  // console.log('in create article ', urls);
  
  return (
    <div className="mt-6">
      <div className="field">
      <label className="label">Titre</label>
      <div className="control">
        <input className="input" type="text" placeholder="titre" name="title" />
      </div>
    </div>

    <div className="field">
      <label className="label">introduction</label>
      <textarea className="textarea is-small" placeholder="introduction" name="introduction"></textarea>
    </div>

    <div className="field">
      <label className="label">Texte</label>
      <textarea className="textarea is-large" placeholder="Texte" name="main" rows={10} cols={40}></textarea>
    </div>

    <div className="field">
      <label className="label">lien audio principal</label>
      <div className="control">
        <input className="input" type="text" placeholder="lien audio" name="mainAudioUrl" />
      </div>
    </div>

    <div className="field">
      <label className="label is-inline-flex">lien vers l'illustration</label>
      <div className="control">
        <input className="input" type="text" placeholder="lien vers l'illustration" name="urlToMainIllustration" />
      </div>
    </div>
    <ArticleTitle
      text="Ajouter des liens multimédias"
      level="h4"
      size="medium"
      color="white"
      spacings="mt-5 mb-4"
    />
    {/* <AddUrlsObjects /> */}
    {/* <UrlObjectIterator
      addUrls={setUrls}
      type={'audio' as UrlsTypes}
      url="https://google.com"
      credits="google"
    /> */}
    <AddUrlsObjects
      urls={urls}
      updateUrls={updateUrls}
      addInputs={addInputs}
      removeInputs={removeInputs}
    />
  </div>);
}