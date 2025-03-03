// import { Article } from '@/models/article';

export default function CreatearticlesForm() {
  
  return (
    <div className="mt-6">
      <div className="field">
      <label className="label">Titre</label>
      <div className="control">
        <input className="input" type="text" placeholder="titre" name="title" />
      </div>
    </div>

    <div className="field">
      <label className="label">introduction</label>
      <textarea className="textarea is-small" placeholder="introduction" name="introduction"></textarea>
    </div>

    <div className="field">
      <label className="label">Texte</label>
      <textarea className="textarea is-large" placeholder="Texte" name="main" rows={10} cols={40}></textarea>
    </div>

    <div className="field">
      <label className="label">lien audio principal</label>
      <div className="control">
        <input className="input" type="text" placeholder="lien audio" name="mainAudioUrl" />
      </div>
    </div>

    <div className="field">
      <label className="label">lien vers l'illustration</label>
      <div className="control">
        <input className="input" type="text" placeholder="lien vers l'illustration" name="urlToMainIllustration" />
      </div>
    </div>

  </div>);
}