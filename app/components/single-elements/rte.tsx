'use client';
import dynamic from 'next/dynamic';
import { useMemo, useEffect } from 'react';

import 'react-quill-new/dist/quill.snow.css';
import './rte.css';

/**
 * @packageDocumentation
 * Rich Text Editor (RTE) React component wrapper for react-quill-new.
 *
 * This module exposes a default RTE component used to render a Quill-based
 * rich text editor that integrates with a generic form-watch/register API.
 * The component defers loading of the heavy editor code to the client via a
 * dynamic import to avoid server-side rendering issues.
 *
 * @remarks
 * - The component registers a 'main' field on mount.
 * - The component uses the provided `watch` function to obtain the current
 *   editor value and calls `getMainContent` on changes.
 * - Styling for the editor is expected to be provided via the imported CSS.
 *
 * @public
 */

/**
 * Props for the RTE component.
 *
 * @property {'field-id'} - DOM id applied to the underlying ReactQuill component.
 * @property {'aria-label'} - Accessibility label applied to the editable region.
 * @property {string} [className] - Optional CSS class applied to the editor container.
 * @property {'data-testid'} - Test identifier string used by testing tools.
 * @property {(v: string) => void} getMainContent - Callback invoked with the editor's content
 *   whenever it changes.
 * @property {(names?: string | string[] | ((data: any, options: any) => void)) => unknown} watch -
 *   Function that returns current form values; used to read the 'main' field.
 * @property {(name: string, options?: any) => { onChange: any; onBlur: any; name: any; ref: any }} register -
 *   Function used to register form fields; this component registers the 'main' field on mount.
 *
 * @public
 */

/**
 * RTE component
 *
 * A lightweight wrapper around react-quill-new that:
 * - Dynamically imports the editor (no SSR),
 * - Registers a 'main' form field on mount,
 * - Binds the editor value to the form via `watch` and forwards changes via `getMainContent`.
 *
 * @example
 * <RTE
 *   field-id="article-body"
 *   aria-label="Article body"
 *   data-testid="rte-body"
 *   className="my-editor"
 *   getMainContent={(html) => setValue('main', html)}
 *   watch={watch}
 *   register={register}
 * />
 *
 * @returns {JSX.Element} The rich text editor element.
 *
 * @public
 */

export default function RTE(props: {
  'field-id': string;
  'aria-label': string;
  className?: string;
  'data-testid': string;
  getMainContent: (v: string) => void;
  watch: (
    names?: string | string[] | ((data: any, options: any) => void)
  ) => unknown;
  register: (
    name: string,
    options?: any
  ) => { onChange: any; onBlur: any; name: any; ref: any };
}) {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill-new'), { ssr: false }),
    []
  );

  useEffect(() => {
    props.register('main');
  }, [props.register]);

  const onChange = (mainState: string) => {
    props.getMainContent(mainState);
  };

  const mainContent = props.watch('main');

  return (
    <ReactQuill
      id={props['field-id']}
      theme="snow"
      value={mainContent as string}
      onChange={onChange}
    >
      <div
        aria-label={props['aria-label']}
        className={`custom-text-area ${props.className}`}
        data-testid={props['data-testid']}
      />
    </ReactQuill>
  );
}
