/**
 * @packageDocumentation
 * Client-side React component for managing a single URL entry within an article's collection.
 *
 * The component renders:
 * - A select input for choosing a UrlsTypes value (website, videos, audio, sociaux, image)
 * - Text inputs for the URL and optional credits
 * - An action button that adds a new entry or updates an existing one if the URL matches
 *
 * Behavior:
 * - On any field change, a "blink" CSS class is applied to indicate pending modifications
 * - Clicking the action button removes the blink and invokes the provided addUrls callback with the current values and index
 *
 * Accessibility and testing:
 * - Uses aria-labels and roles to aid assistive technologies
 * - Exposes data-testid attributes for reliable querying in tests
 *
 * Styling and dependencies:
 * - Consumes a CSS module that provides a "blink" class
 * - Uses Bulma utility classes for layout
 *
 * @remarks
 * Designed to be used within Next.js as a "use client" component and to work with the UrlsTypes enum exported from the article model.
 *
 * @see UrlsTypes
 * @see UrlObjectItem
 *
 * @example
 * // Basic usage
 * <UrlObjectItem
 *   index={0}
 *   urls={[
 *     { type: UrlsTypes.WEBSITE, url: "https://example.com", credits: "Example Inc." }
 *   ]}
 *   addUrls={(newUrl, index) => {
 *     // Persist or update the URL entry at the given index
 *     console.log(index, newUrl);
 *   }}
 * />
 */
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
        <label className="mr-2" htmlFor={`url-${index}`}>url</label>
        <input
          type="url"
          name={`url-${index}`}
          id={`url-${index}`}
          value={givenUrl || ""}
          onChange={(e) => {
            addBlink(e?.currentTarget?.parentNode as unknown as HTMLDivElement);
            setGivenUrl(e.target.value)
          }}
        />
      </div>
      <div className="ml-2">
        <label className="mr-2" htmlFor={`credits-${index}`}>crédits</label>
        <input
          type="text"
          name={`credits-${index}`}
          id={`credits-${index}`}
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
