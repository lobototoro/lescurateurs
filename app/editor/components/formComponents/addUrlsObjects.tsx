"use client";

// import { useState } from "react";
import { Article, UrlsTypes } from "@/models/article";

export function AddUrlsObjects({
  urls,
  setUrls,
}: {
  urls?: Pick<Article, "urls">;
  setUrls?: React.Dispatch<React.SetStateAction<any>>;
}) {
  console.info(urls, setUrls);

  // const [added, setAdded] = useState<Pick<Article, "urls"> | null>(null);

  return (
    <div className="field is-grouped is-flex is-align-items-center">
      <div className="">
        <label className="is-hidden">Selectionnez un type</label>
        <div className="select">
          <select>
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
        <input type="url" name="url" />
      </div>
      <div className="ml-2">
        <label className="mr-1">crédits</label>
        <input type="text" name="credits" />
      </div>
      <button type="submit" className="button">Ajouter</button>
    </div>
  );
};