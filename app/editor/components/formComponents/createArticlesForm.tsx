"use client";
import React from "react";

import { AddUrlsObjects } from "./addUrlsObjects";

// import { UrlObjectIterator } from "./urlObjectIter";
import { UrlsTypes } from '@/models/article';

export default function CreatearticlesForm() {
  const initialUrls = [
    {
      type: 'website' as UrlsTypes,
      url: '',
      credits: '',
    }
  ]
  const [urls, setUrls] = React.useState<{ type: UrlsTypes; url: string; credits?: string }[]>(initialUrls);
  const addInputs = () => {
    setUrls([...urls, ...initialUrls]);
  }
  const removeInputs = () => {
    if (urls.length > 1) {
      setUrls(urls.slice(0, -1));
    }
  }
  console.log('in create article ', urls);
  
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
    {/* <AddUrlsObjects /> */}
    {/* <UrlObjectIterator
      addUrls={setUrls}
      type={'audio' as UrlsTypes}
      url="https://google.com"
      credits="google"
    /> */}
    <AddUrlsObjects
      urls={urls}
      setUrls={setUrls}
      addInputs={addInputs}
      removeInputs={removeInputs}
    />
  </div>);
}