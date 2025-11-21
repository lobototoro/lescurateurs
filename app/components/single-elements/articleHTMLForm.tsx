import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { AddUrlsObjects } from '@/app/editor/components/formComponents/addUrlsObjects';
import { isEmpty } from '@/lib/utility-functions';
import RTE from '@/app/components/single-elements/rte';

/**
 * @packageDocumentation
 * @module ArticleMarkupForm
 *
 * Main form component used to create or update article content in the editor.
 * It renders title/introduction inputs, a rich text editor (RTE), media URL inputs,
 * a dynamic list of media link inputs and a submit button. Validation errors
 * are surfaced inline using the `errors` prop and a top-level message is shown
 * when any validation errors exist.
 *
 * This file exports the default React component `ArticleMarkupForm`.
 *
 * @remarks
 * - The component is controlled via external form registration helpers (e.g. react-hook-form)
 *   that are passed through the `register`, `handleSubmit`, `watch`, and `errors` props.
 * - The rich text editor is integrated via a child component and communicates content
 *   back to the parent through the `getMainContent` callback.
 *
 * @example
 * ```tsx
 * <ArticleMarkupForm
 *   handleSubmit={handleSubmit}
 *   register={register}
 *   errors={errors}
 *   urlsToArray={urls}
 *   updateUrls={updateUrls}
 *   addInputs={addInputs}
 *   removeInputs={removeInputs}
 *   target="create"
 *   isPending={isSubmitting}
 *   getMainContent={(html) => setMainHtml(html)}
 *   watch={watch}
 * />
 * ```
 */

/**
 * Properties accepted by the ArticleMarkupForm component.
 *
 * @typedef {Object} ArticleMarkupFormProps
 * @property {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit
 *   Callback invoked when the form is submitted. Receives the native form event.
 *
 * @property {(name: string, options?: any) => { onChange: any; onBlur: any; name: any; ref: any }} register
 *   Form registration function (commonly provided by react-hook-form). Used to register
 *   each input so validation and value tracking are handled externally.
 *
 * @property {any} errors
 *   Validation error object where keys correspond to field names. Each error entry
 *   is expected to provide a `message` string for display.
 *
 * @property {any[]} urlsToArray
 *   Array representing the dynamic list of media URL objects rendered by the form.
 *
 * @property {(newUrl: any, index: number) => void} updateUrls
 *   Function to update a specific URL object in the `urlsToArray` list.
 *
 * @property {() => void} addInputs
 *   Adds one new URL input to the list.
 *
 * @property {() => void} removeInputs
 *   Removes one URL input from the list.
 *
 * @property {string} target
 *   Mode the form is used in. Common values: `"create"` or `"update"`. When `"update"`,
 *   certain inputs may be disabled (for example the title input).
 *
 * @property {boolean=} isPending
 *   When true, the submit input shows a loading state.
 *
 * @property {(v: string) => void} getMainContent
 *   Callback invoked by the rich text editor to pass the current HTML/content string
 *   back to the parent for storage or validation.
 *
 * @property {(names?: string | string[] | ((data: any, options: any) => void)) => unknown} watch
 *   Watch function from the form library to subscribe to field value changes.
 *
 * @public
 */

export default function ArticleMarkupForm({
  handleSubmit,
  register,
  errors,
  urlsToArray,
  updateUrls,
  addInputs,
  removeInputs,
  target,
  isPending,
  getMainContent,
  watch,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: (
    name: string,
    options?: any
  ) => { onChange: any; onBlur: any; name: any; ref: any };
  errors: any;
  urlsToArray: any[];
  updateUrls: (newUrl: any, index: number) => void;
  addInputs: () => void;
  removeInputs: () => void;
  target: string;
  isPending?: boolean;
  getMainContent: (v: string) => void;
  watch: (
    names?: string | string[] | ((data: any, options: any) => void)
  ) => unknown;
}) {
  return (
    <form onSubmit={handleSubmit} data-testid="article-form">
      <div className="mt-6">
        <div className="field">
          <label className="label" aria-labelledby="title" htmlFor="title">
            Titre
          </label>
          <div className="field">
            <input
              id="title"
              className="input"
              type="text"
              {...register('title')}
              data-testid="title"
              disabled={target === 'update'}
            />
          </div>
          {errors.title && (
            <p className="has-text-danger">{errors.title.message}</p>
          )}
        </div>

        <div className="field">
          <label
            className="label"
            aria-labelledby="introduction"
            htmlFor="introduction"
          >
            introduction
          </label>
          <textarea
            id="introduction"
            aria-label="introduction"
            className="textarea"
            {...register('introduction')}
            rows={5}
            data-testid="introduction"
          ></textarea>
          {errors.introduction && (
            <p className="has-text-danger">{errors.introduction.message}</p>
          )}
        </div>

        <div className="field">
          <label className="label" aria-labelledby="main" htmlFor="main">
            Texte
          </label>
          <RTE
            field-id="main"
            aria-label="main"
            className="is-family-primary has-text-weight-normal is-size-6 has-text-white"
            data-testid="main"
            getMainContent={getMainContent}
            watch={watch}
            register={register}
          />
          {errors.main && (
            <p className="has-text-danger">{errors.main.message}</p>
          )}
        </div>

        <div className="field">
          <label
            className="label is-inline-flex"
            aria-label="urlToMainIllustration"
            htmlFor="urlToMainIllustration"
          >
            lien vers l'illustration
          </label>
          <div className="control">
            <input
              id="urlToMainIllustration"
              aria-label="urlToMainIllustration"
              className="input"
              type="url"
              {...register('url_to_main_illustration')}
              data-testid="urlToMainIllustration"
            />
          </div>
          {errors.url_to_main_illustration && (
            <p className="has-text-danger">
              {errors.url_to_main_illustration.message}
            </p>
          )}
        </div>

        <div className="field">
          <label
            className="label"
            aria-label="mainAudioUrl"
            htmlFor="mainAudioUrl"
          >
            lien audio principal
          </label>
          <div className="control">
            <input
              id="mainAudioUrl"
              aria-label="mainAudioUrl"
              className="input"
              type="url"
              {...register('main_audio_url')}
              data-testid="mainAudioUrl"
            />
          </div>
          {errors.main_audio_url && (
            <p className="has-text-danger">{errors.main_audio_url.message}</p>
          )}
        </div>

        <ArticleTitle
          text="Ajouter des liens multimédias"
          level="h4"
          size="medium"
          color="white"
          spacings="mt-5 mb-4"
        />
        {errors.urls && (
          <p className="has-text-danger">{errors.urls.message}</p>
        )}
        <AddUrlsObjects
          urls={urlsToArray}
          updateUrls={updateUrls}
          addInputs={addInputs}
          removeInputs={removeInputs}
        />
      </div>

      {!isEmpty(errors) && (
        <p className="has-text-danger">
          Des erreurs existent dans le formulaire.
        </p>
      )}
      <div className="field mt-5">
        <input
          type="submit"
          className={
            isPending
              ? 'is-loading'
              : 'button is-primary is-size-6 has-text-white'
          }
          value="Valider"
          data-testid="final-submit"
          disabled={!isEmpty(errors)}
        />
      </div>
    </form>
  );
}
