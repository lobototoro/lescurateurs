import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { AddUrlsObjects } from '@/app/editor/components/formComponents/addUrlsObjects';
import { isEmpty } from '@/lib/utility-functions';
import RTE from '@/app/components/single-elements/rte';

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
  urlsToArray: Array<{ type: string; url: string; credits?: string }>;
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
