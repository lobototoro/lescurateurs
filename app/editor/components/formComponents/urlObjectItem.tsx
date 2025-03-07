"use client";
import React from "react";

import { UrlsTypes } from "@/models/article";

export function UrlObjectItem({
  type,
  url,
  credits,
  urls,
  index,
  addUrls
}: {
  type?: UrlsTypes;
  url?: string;
  credits?: string;
  urls?: { type: UrlsTypes; url: string; credits?: string }[];
  index: number;
  addUrls?: (newUrl: { type: UrlsTypes; url: string; credits?: string }, index: number) => void;
}) {
  const [selectedValue, setSelectedValue] = React.useState<UrlsTypes>(type || UrlsTypes.WEBSITE);
  const [givenUrl, setGivenUrl] = React.useState<string>(url || '');
  const [givenCredits, setGivenCredits] = React.useState<string>(credits || '');

  const isinArray = (url: string) => {
    return urls?.some((item) => item.url === url && item.url !== '');
  };

  return (
    <div className="field is-grouped is-flex is-align-items-center">
      <div className="">
        <label className="is-hidden">Selectionnez un type</label>
        <div className="select">
          <select
            role="combobox"
            aria-label="Selectionnez un type"
            value={selectedValue || UrlsTypes.WEBSITE}
            onChange={(e) => setSelectedValue(e.target.value as UrlsTypes)}
          >
            <option value={UrlsTypes.WEBSITE}>website</option>
            <option value={UrlsTypes.VIDEOS}>videos</option>
            <option value={UrlsTypes.AUDIO}>audio</option>
            <option value={UrlsTypes.SOCIAL}>sociaux</option>
            <option value={UrlsTypes.IMAGE}>image</option>
          </select>
        </div>
      </div>
      <div className="ml-2">
        <label className="mr-2" role="label">url</label>
        <input
          role="textbox"
          type="url"
          name="url"
          value={givenUrl || ""}
          onChange={(e) => setGivenUrl(e.target.value)}
        />
      </div>
      <div className="ml-2">
        <label className="mr-2" role="label">crédits</label>
        <input
          role="textbox"
          type="text"
          name="credits"
          value={givenCredits || ""}
          onChange={(e) => setGivenCredits(e.target.value)}
        />
      </div>
      <div
        className="button ml-2"
        onClick={() => addUrls && addUrls({
              type: selectedValue,
              url: givenUrl,
              credits: givenCredits
            },
            index
          )}
      >
        {
          (isinArray(givenUrl)) ? 'Modifier' : 'Ajouter'
        }
      </div>
    </div>
  );
}