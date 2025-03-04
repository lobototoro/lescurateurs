"use client";

// import { useState } from "react";
import { UrlsTypes } from "@/models/article";
import { UrlObjectIterator } from "./urlObjectIter";

export function AddUrlsObjects({
  urls,
  setUrls,
  addInputs,
  removeInputs
}: {
  urls: { type: UrlsTypes; url: string; credits?: string }[];
  setUrls: React.Dispatch<React.SetStateAction<any>>;
  addInputs: () => void;
  removeInputs: () => void;
}) {

  return (
    <>
    <div className="field">
      {urls?.map(({ type, url, credits }, index: number) => (
        
          <UrlObjectIterator
            key={`add-url-${index}`}
            type={type || UrlsTypes.WEBSITE}
            url={url || ''}
            credits={credits || ''}
            addUrls={setUrls}
          />
          
      ))}
      <div className="button is-primary" onClick={addInputs}>
            +
      </div>
      <div className="button is-primary" onClick={removeInputs}>
            -
      </div>
      </div>
    </>
  );
};