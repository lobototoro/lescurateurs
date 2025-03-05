"use client";

// import { useState } from "react";
import { UrlsTypes } from "@/models/article";
import { UrlObjectItem } from "./urlObjectItem";

export function AddUrlsObjects({
  urls,
  updateUrls,
  addInputs,
  removeInputs
}: {
  urls: { type: UrlsTypes; url: string; credits?: string }[];
  updateUrls: (newUrl: { type: UrlsTypes; url: string; credits?: string }, index: number) => void;
  addInputs: () => void;
  removeInputs: () => void;
}) {

  return (
    <>
      <div className="field">
        {urls?.map(({ type, url, credits }, index: number) => (
          
            <UrlObjectItem
              key={`add-url-${index}`}
              type={type}
              url={url}
              credits={credits}
              urls={urls}
              index={index}
              addUrls={updateUrls}
            />
            
        ))}
        <div className="mt-5">
          <div className="button is-primary is-size-6 has-text-white" onClick={addInputs}>
                +
          </div>
          <div className="button is-primary ml-2 is-size-6 has-text-white" onClick={removeInputs}>
                -
          </div>
        </div>
      </div>
    </>
  );
};