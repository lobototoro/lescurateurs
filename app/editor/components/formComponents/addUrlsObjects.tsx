/**
 * Module: components/AddUrlsObjects
 *
 * @packageDocumentation
 *
 * Renders a dynamic list of URL input rows for article-related resources and exposes
 * handlers to update, add, and remove inputs. Each row is rendered via the UrlObjectItem
 * child component.
 *
 * @remarks
 * The component expects the following props:
 * - urls: an array conforming to CustomFormInputs (each item contains type, url, credits)
 * - updateUrls: callback invoked with the new url object and the index to update
 * - addInputs: callback to append a new empty input row
 * - removeInputs: callback to remove the last input row
 *
 * @example
 * <AddUrlsObjects
 *   urls={[{ type: 'image', url: 'https://example.com/photo.jpg', credits: 'Alice' }]}
 *   updateUrls={(newUrl, index) => { /* update logic  }}
 *   addInputs={() => { /* add logic  }}
 *   removeInputs={() => { /* remove logic  }}
 * />
 */

/**
 * AddUrlsObjects component
 *
 * Renders url input items and controls to add or remove inputs.
 *
 * @param props - Component properties
 * @param props.urls - Current collection of URL input objects (CustomFormInputs)
 * @param props.updateUrls - Function called when a URL item changes. Receives (newUrl, index).
 * @param props.addInputs - Function to append a new empty URL input.
 * @param props.removeInputs - Function to remove the last URL input.
 *
 * @returns A JSX.Element containing the list of UrlObjectItem rows and add/remove buttons.
 *
 * @public
 * @category Components
 */
'use client';
import { UrlsTypes, CustomFormInputs } from '@/models/article';
import { UrlObjectItem } from './urlObjectItem';

export function AddUrlsObjects({
  urls,
  updateUrls,
  addInputs,
  removeInputs,
}: {
  urls: CustomFormInputs;
  updateUrls: (
    newUrl: { type: UrlsTypes; url: string; credits?: string },
    index: number
  ) => void;
  addInputs: () => void;
  removeInputs: () => void;
}) {
  return (
    <>
      <div className="field" data-testid="url-inputs-container">
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
          <div
            className="button is-primary is-size-6 has-text-white"
            data-testid="add-url"
            onClick={addInputs}
          >
            +
          </div>
          <div
            className="button is-primary ml-2 is-size-6 has-text-white"
            data-testid="remove-url"
            onClick={removeInputs}
          >
            -
          </div>
        </div>
      </div>
    </>
  );
}
