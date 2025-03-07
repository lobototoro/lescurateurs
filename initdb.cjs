/* eslint-disable @typescript-eslint/no-var-requires */
const sql = require('better-sqlite3');

const slugify = require('slugify');

const db = sql('lcfr.db');

const users = [
  {
    email: 'psinivassin@gmail.com', // main identifier
    tiersServiceIdent: 'auth0|67974464d8a5d38fbb08fe71', // currently auth0 services
    role: 'admin', // admin | contributor | reader
    permissions: JSON.stringify([
      'read:articles',
      'create:articles',
      'update:articles',
      'delete:articles',
      'validate:articles',
      'ship:articles',
      'create:user',
      'update:user',
      'delete:user',
      'enable:maintenance'
    ]),
    createdAt: '2022-01-01',
    lastConnectionAt: '2022-01-01'
  },
  {
    email: 'pablo@lescurateurs.fr',
    tiersServiceIdent: 'auth0|67976dd5196a218fee3842f8',
    role: 'contributor',
    permissions: JSON.stringify([
      'read:articles',
      'create:articles',
      'update:articles',
      'validate:articles'
    ]),
    createdAt: '2022-01-01',
    lastConnectionAt: '2022-01-01'
  }
]

const slugs = [
  {
    slug: 'wash-the-sins-not-only-the-face',
    createdAt: '2022-01-01'
  },
  {
    slug: 'bosnian-rainbows-bosnian-rainbows',
    createdAt: '2022-01-01'
  }
];

const articles = [
  {
    slug: slugify('Wash the sins not only the face', { lower: true }),
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
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
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
    ]),
    validated: 'false',
    shipped: 'false'
  },
  {
    slug: slugify('Bosnian Rainbows / Bosnian Rainbows', { lower: true }),
    title: 'Bosnian Rainbows',
    introduction: 'Bosnian Rainbows, 2013',
    main: `Eli
    Worthless
    Dig Right In Me
    The Eye Fell In Love
    Cry For You
    Morning Sickness
    Torn Maps
    Turtle Neck
    Always On The Run
    Red
    Mother, Father, Set Us Free
    
    
    Depuis le temps que je suis le parcours flamboyant et quelque peu imprévisible d’Omar Rodriguez Lopez, je m’étais habitué de n’être qu’étonné, candide spectateur de nos amis les musiciens-indés-les-génies-malingres-un-peu-fous.
    L’animal, je l’ai découvert sur la tard, à la fin de At The Drive-in, avec ce jeu de guitare caractéristique, le mec qui donne l’impression de ne jouer qu’avec des dissonances, des presque fausses notes dans la gamme mais qui au final à lui seul justifiait l’écoute de ce groupe indé texan à grosses guitares(les fans d’ATDI me pardonnent). Comme quoi.
    
    De la finesse et de la folie dans son jeu, une envie de toujours se risquer dans des territoires progressifs et perdus en désuétudes (avec pour fantômes rémanent le rock prog, les accents psychotropiques et le constructivisme sonore de la no-wave des années 70) qui l’ont menés de The Mars Volta à ses expérimentations personnelles, ses différents “orchestres”[http://rodriguezlopezproductions.com/], avec environ 3 à 4 galettes produites par an et des collaborations artistiques avec des gens aussi enflammés que lui : Lydia Lunch, antique prêtresse de l’underground new-yorkais ou John frusciante, beaucoup plus intéressant en solo que chez les Red Hot Chili Peppers.
    Du coup, le voir fusionner The Mars Volta et The Butcherettes, ça faisait comme un frisson dans le dos.
    
    Soit donc, Omar Rodriguez Lopez.
    Ajoutez la grâce et le feulement animal de Terri Gender Bender, chanteuse plus connue aux côtés de son groupe, The butcherettes (de Guadalaraja !), magistrale dans son rôle de Madame Loyale, cascadeuse des cordes vocales entre cri guerrier punk et enjôleuse romantique. Sa voix est volontairement mise en avant, elle donne le ton, la note, et surtout la couleur sensuelle car après tout, ce premier album est réellement romantique.
    Nicci Kasper et Deantoni Parks se font plus discret aux claviers et à la batterie (Deantoni Parks joue la batterie main gauche / pieds et les basses au clavier, main droite, un vrai athlète), un chœur harmonieux fondu et effacé derrière leur rôle premier, jouer.
    
    Du coup je m’attendais à de la fusion mariachi, à du rock latino-bossa, à un ovni de plus au tableau d’honneur des disques les plus branques de la planète... Bien mal m’en a pris de découvrir les premières vidéos sur youtube, les premiers sons volés disponibles sur les réseaux P2P...
    En fait pas du tout, Bosnian Rainbows, c’est de la pop, croisée entre les Siouxie et le rock mid-tempo des années 80 (superbe chanson glam-noisy Torn Maps, Turtle Neck).
    On retrouve des expériences, des mélanges d’influences propres à (feu) Mars volta dans Dig Right in Me, une expérience voix/machines en osmose dans I Cry For You.
    Une musique intelligente avec tout ce qu’il faut de l’air du temps pour sonner juste, un contre-pied total à ce qu’ils ont fait respectivement dans leurs propres formations, une échappée poétique dans un univers pop, prog et léger, au sein d’une nouvelle entité, une nouvelle aventure.    
    `,
    mainAudioUrl: 'https://bosnianrainbows.bandcamp.com/',
    urlToMainIllustration: 'bosnian-rainbows-bosnian-rainbows/BosnianRainbows_SH100_1024x1024.jpg',
    publishedAt: '2022-01-01',
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
    author: 'John Doe',
    author_email: 'johndoe@example.com',
    urls: JSON.stringify([
      {
        type: "videos",
        url: "https://www.youtube.com/watch?v=cnfx0cij2rw&list=PL0uAFlGfAhhFuT_9yacVujeoAJHaLSnbo&index=4"
      },
      {
        type: "website",
        url: "https://bosnianrainbows.bandcamp.com/"
      },
      {
        type: "image",
        url: "bosnian-rainbows-bosnian-rainbows/bosnian-rainbows-band-626x417.jpg"
      },
      {
        type: "image",
        url: "bosnian-rainbows-bosnian-rainbows/BosnianRainbowsTD000E.jpg",
        credits: 'https://tonedeaf.thebrag.com/photo/bosnian-rainbows-omar-rodrguezlpez/'
      },
      {
        type: "image",
        url: "bosnian-rainbows-bosnian-rainbows/teri-gender-bender-de-le-butcherettes-et-bosnian-rainbows.avif",
        credits: '© Erik Voake / Red Bull Content Pool'
      }
    ]),
    validated: 'false',
    shipped: 'false'
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
       createdAt DATE NOT NULL,
       updatedAt DATE NOT NULL,
       author TEXT NOT NULL,
       author_email TEXT NOT NULL,
       urls TEXT,
       validated TEXT NOT NULL,
       shipped TEXT NOT NULL
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS slugs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      createdAt DATE NOT NULL
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       email TEXT NOT NULL UNIQUE,
       tiersServiceIdent TEXT NOT NULL UNIQUE,
       role TEXT NOT NULL,
       permissions TEXT,
       createdAt DATE NOT NULL,
       lastConnectionAt DATE
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
         @createdAt,
         @updatedAt,
         @author,
         @author_email,
         @urls,
         @validated,
         @shipped
      )
   `);
  const stmt2 = db.prepare(`
      INSERT INTO slugs VALUES (
         null,
         @slug,
         @createdAt
      )
   `);
  const stm3 = db.prepare(`
      INSERT INTO users VALUES (
         null,
         @email,
         @tiersServiceIdent,
         @role,
         @permissions,
         @createdAt,
         @lastConnectionAt
      )
   `);
  for (const user of users) {
    stm3.run(user);
  }
  for (const slug of slugs) {
    stmt2.run(slug);
  }
  for (const article of articles) {
    stmt.run(article);
  }
}

initData();