"use client";
import React from "react";

import { UrlsTypes } from "@/models/article";

export function UrlObjectIterator({
  type,
  url,
  credits,
  addUrls
}: {
  type?: UrlsTypes;
  url?: string;
  credits?: string;
  addUrls?: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [selectedValue, setSelectedValue] = React.useState<UrlsTypes>(type || UrlsTypes.WEBSITE);
  const [givenUrl, setGivenUrl] = React.useState<string>(url || '');
  const [givenCredits, setGivenCredits] = React.useState<string>(credits || '');

  return (
    <div className="field is-grouped is-flex is-align-items-center">
      <div className="">
        <label className="is-hidden">Selectionnez un type</label>
        <div className="select">
          <select
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
        <label className="mr-1">url</label>
        <input
          type="url"
          name="url"
          value={givenUrl || ""}
          onChange={(e) => setGivenUrl(e.target.value)}
        />
      </div>
      <div className="ml-2">
        <label className="mr-1">crédits</label>
        <input
          type="text"
          name="credits"
          value={givenCredits || ""}
          onChange={(e) => setGivenCredits(e.target.value)}
        />
      </div>
      <div
        className="button ml-2"
        onClick={() => addUrls && addUrls(
          {
            type: selectedValue,
            url: givenUrl,
            credits: givenCredits,
          })}
      >
        {(!type && !url && !credits) ? 'Ajouter' : 'Modifier'}
      </div>
    </div>
  );
}