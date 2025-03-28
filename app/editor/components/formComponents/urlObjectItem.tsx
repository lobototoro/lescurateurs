"use client";
import React from "react";

import { UrlsTypes } from "@/models/article";
import styles from './urlObjectItem.module.css';

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

  const blinkClass = styles.blink;
  const addBlink = (el: HTMLDivElement) => {
    (el?.parentNode?.lastChild as HTMLElement)?.classList.add(blinkClass);
  }

  const removeBlink = (el: HTMLDivElement) => {
    el?.classList.remove(blinkClass);
  }

  return (
    <div className="field is-grouped is-flex is-align-items-center">
      <div className="">
        <label className="is-hidden">Selectionnez un type</label>
        <div className="select">
          <select
            role="combobox"
            aria-label="Selectionnez un type"
            data-testid="select-type"
            name={`type-${index}`}
            value={selectedValue || UrlsTypes.WEBSITE}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              addBlink(e?.currentTarget?.parentNode?.parentNode as unknown as HTMLDivElement);
              setSelectedValue(e.target.value as UrlsTypes);
            }}
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
        <label className="mr-2">url</label>
        <input
          type="url"
          name={`url-${index}`}
          value={givenUrl || ""}
          onChange={(e) => {
            addBlink(e?.currentTarget?.parentNode as unknown as HTMLDivElement);
            setGivenUrl(e.target.value)
          }}
        />
      </div>
      <div className="ml-2">
        <label className="mr-2" role="label">crédits</label>
        <input
          type="text"
          name={`credits-${index}`}
          value={givenCredits || ""}
          onChange={(e) => {
            addBlink(e?.currentTarget?.parentNode as unknown as HTMLDivElement
            );
            setGivenCredits(e.target.value)
          }}
        />
      </div>
      <div
        className="button ml-2"
        data-testid="add-url-button"
        onClick={(e) => {
          removeBlink(e?.currentTarget as unknown as HTMLDivElement);
          addUrls && addUrls({
              type: selectedValue,
              url: givenUrl,
              credits: givenCredits
            },
            index
          )}}
      >
        {
          (isinArray(givenUrl)) ? 'Modifier' : 'Ajouter'
        }
      </div>
    </div>
  );
}