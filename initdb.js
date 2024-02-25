const sql = require('better-sqlite3');
const db = sql('articles.db');

const articles = [
  {
    slug: 'wash-the-sins-not-only-the-face',
    title: 'Wash the sins not only the face',
    introduction: 'Esben and The Witch, 2013',
    main: `Iceland Spar
    Slow Wave
    When That Head Splits
    Shimmering
    Deathwaltz
    Yellow Wood
    Despair
    Putting Down the Prey
    The Fall of Glorieta Mountain
    Smashed to Pieces in the Still of the Night
    
    Esben and The Witch sur son précédent opus œuvrait dans une veine rock sombre, à la violence mesurée par le chant, et sa musique par ailleurs ne s’empêchait aucunement des penchants gothiques ou new-wave voire tribaux et industriels, de la poésie scandée sur des rythmes lents et lourds, accompagnées par des percussions naturelles ou synthétiques.
    
    La poésie encore, en l'occurrence, des évocations incertaines et des images allégoriques très abstraites émaillent toutes les chansons, la confrontation permanente de l’individu au monde qui l’entoure, la perte de l’humanité diluée dans les grands nombres, les nombres incertains d’une vie, l’hostilité du monde environnant, l’étrangeté de l’existence, l’émerveillement et la conscience d’un soi mourant à petit feu... La voix angélique de Rachel Davies est pour beaucoup dans la beauté diaphane qui se dégage des chansons du groupe, un alliage serein de mots aux syllabes allongées avec un jeu sur les sonorités mêlés aux motifs liquides en dentelle des guitares et des percussions. Pour peu que vous goûtiez à de la poésie en prose, les lyrics en eux-même valent le détour, dans un anglais académique soutenu mais empreint d’une réelle élégance.
    
    Ce mélange particulier, qu’on qualifierait de pop macabre au premier degré ( faute de mieux ) trouve son achèvement sur des morceaux comme Despair ou when that head splits, entre rage et crispation sévère où la mélancolie et les voix plaintives se mêlent, la musique en miroir, tranchante et brillante à la fois.
    Esben and the Witch vaut mieux que l’étiquette “groupe goth” qu’on lui affuble dès la sortie de ses premières incursions sur les scènes anglaises ( ils sont originaires de Brighton ) en 2010, œuvrant dans un registre serré, capable de virages à 180° et d’évolutions sans pareils dans leur musique.
    
    Cet album est une nouvelle orientation pour le groupe, au regard de l’atmosphère gothique et lourde de l’album précédent, et muni d’un batteur, le groupe se lance sur des formats plus conventionnels, mais plus incisifs, plus rock mais réellement sophistiqués. La production de ce son uni, oppressant, montre l’attachement de ces musiciens aux détails, et ce disque saignant transporte sans heurts, loin.
    `,
    mainAudioUrl: null,
    urlToMainIllustration: 'wash-the-sins-not-only-the-face/R-4206704-1358536944-7924.jpg',
    publishedAt: '2022-01-01',
    createAt: '2022-01-01',
    updateAt: '2022-01-01',
    author: 'John Doe',
    author_email: 'johndoe@example.com',
    urls: JSON.stringify([
      {
        type: "videos",
        url: "https://www.youtube.com/watch?v=cnfx0cij2rw&list=PL0uAFlGfAhhFuT_9yacVujeoAJHaLSnbo&index=4"
      },
      {
        type: "website",
        url: "https://esbenandthewitch.bandcamp.com/"
      },
      {
        type: "website",
        url: "https://hausnostromo.com/"
      },
      {
        type: "image",
        url: "wash-the-sins-not-only-the-face/img-11039.jpg"
      },
      {
        type: "image",
        url: "wash-the-sins-not-only-the-face/nodogtee.jpg"
      }
    ])
  }
];

db.prepare(`
   CREATE TABLE IF NOT EXISTS articles (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       introduction TEXT,
       main TEXT NOT NULL,
       mainAudioUrl TEXT,
       urlToMainIllustration TEXT NOT NULL,
       publishedAt DATE,
       createAt DATE NOT NULL,
       updateAt DATE NOT NULL,
       author TEXT NOT NULL,
       author_email TEXT NOT NULL,
       urls TEXT
    )
`).run();

async function initData() {
  const stmt = db.prepare(`
      INSERT INTO articles VALUES (
         null,
         @slug,
         @title,
         @introduction,
         @main,
         @mainAudioUrl,
         @urlToMainIllustration,
         @publishedAt,
         @createAt,
         @updateAt,
         @author,
         @author_email,
         @urls
      )
   `);

  for (const article of articles) {
    stmt.run(article);
  }
}

initData();