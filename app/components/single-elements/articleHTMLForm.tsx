import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { AddUrlsObjects } from '@/app/editor/components/formComponents/addUrlsObjects';
import { isEmpty } from '@/lib/utility-functions';

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
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  urlsToArray: any[];
  updateUrls: (newUrl: any, index: number) => void;
  addInputs: () => void;
  removeInputs: () => void;
  target: string;
  isPending?: boolean;
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
          <label className="label" aria-label="main" htmlFor="main">
            Texte
          </label>
          <textarea
            id="main"
            aria-label="main"
            className="textarea"
            {...register('main')}
            rows={10}
            data-testid="main"
          ></textarea>
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
              {...register('urlToMainIllustration')}
              data-testid="urlToMainIllustration"
            />
          </div>
          {errors.urlToMainIllustration && (
            <p className="has-text-danger">
              {errors.urlToMainIllustration.message}
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
              {...register('mainAudioUrl')}
              data-testid="mainAudioUrl"
            />
          </div>
          {errors.mainAudioUrl && (
            <p className="has-text-danger">{errors.mainAudioUrl.message}</p>
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
