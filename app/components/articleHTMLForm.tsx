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
  formSentModal,
  state,
  closeModal,
  target
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  urlsToArray: any[];
  updateUrls: (newUrl: any, index: number) => void;
  addInputs: () => void;
  removeInputs: () => void;
  formSentModal: React.RefObject<HTMLDivElement> | null;
  state: { message: boolean; text: string } | null;
  closeModal: () => void;
  target: string;
}) {

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-6">
        <div className="field">
          <label className="label" aria-label="label du champ Titre" htmlFor="title">Titre</label>
          <div className="field">
            <input className="input" type="text" {...register('title')} data-testid="title" required disabled={(target === 'update')} />
          </div>
          { errors.title && <p className="has-text-danger">{errors.title.message}</p>}
        </div>

        <div className="field">
          <label className="label" aria-label="label du champ introduction" htmlFor="introduction">introduction</label>
          <textarea className="textarea" {...register('introduction')} rows={5} data-testid="introduction" required></textarea>
          { errors.introduction && <p className="has-text-danger">{errors.introduction.message}</p>}
        </div>

        <div className="field">
          <label className="label" aria-label="label du champ Texte" htmlFor="main">Texte</label>
          <textarea className="textarea" {...register('main')} rows={10} data-testid="main" required></textarea>
          { errors.main && <p className="has-text-danger">{errors.main.message}</p>}
        </div>

        <div className="field">
          <label className="label is-inline-flex" aria-label="label du champ lien vers l'illustration" htmlFor="urlToMainIllustration">lien vers l'illustration</label>
          <div className="control">
            <input className="input" type="url" {...register('urlToMainIllustration')} data-testid="urlToMainIllustration" required />
          </div>
          { errors.urlToMainIllustration && <p className="has-text-danger">{errors.urlToMainIllustration.message}</p>}
        </div>

        <div className="field">
          <label className="label" aria-label="label du champ lien audio principal" htmlFor="mainAudioUrl">lien audio principal</label>
          <div className="control">
            <input className="input" type="url" {...register('mainAudioUrl')} data-testid="mainAudioUrl" required />
          </div>
          { errors.mainAudioUrl && <p className="has-text-danger">{errors.mainAudioUrl.message}</p>}
        </div>

        <ArticleTitle
          text="Ajouter des liens multimédias"
          level="h4"
          size="medium"
          color="white"
          spacings="mt-5 mb-4"
        />
        { errors.urls && <p className="has-text-danger">{errors.urls.message}</p>}
        <AddUrlsObjects
          urls={urlsToArray}
          updateUrls={updateUrls}
          addInputs={addInputs}
          removeInputs={removeInputs}
        />
      </div>
    
      { !isEmpty(errors) && <p className="has-text-danger">Des erreurs existent dans le formulaire { `: ${errors.root.random.message}` }</p>}
      
      <div
        className="modal"
        ref={formSentModal}
        data-testid="create-article-modal"
        onClick={() => closeModal()}
      >
        <div className="modal-background"></div>
        <div className={state?.message ? 'modal-content is-success' : 'modal-content is-danger'}>
          <p className="is-size-6 has-text-white has-background-primary p-6">{state?.text}</p>
          <footer>
            <button className="button" aria-label="accept button" onClick={(e: React.MouseEvent) => { e.preventDefault(); closeModal()}}>OK</button>
          </footer>
        </div>
      </div>

      <div className="field mt-5">
        <input type="submit" className="button is-primary is-size-6 has-text-white" value="Valider" data-testid="final-submit" disabled={!isEmpty(errors)} />
      </div>
    </form>
  );
}