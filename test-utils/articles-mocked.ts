export function getMockedArticles() {
  return [
    {
      id: 1,
      title: 'Article title 1',
      slug: 'article-title-1',
      introduction: 'Article introduction 1',
      main: 'Article main 1',
      published_at: '2022-01-01',
      created_at: '2022-01-01',
      updated_at: '2022-01-01',
      updated_by: 'pabblo',
      author: 'Article author 1',
      author_email: 'Article author_email 1',
      urls: [
        {
          type: 'website',
          url: 'https://example.com/article-title-1',
        },
      ],
    },
    {
      id: 2,
      title: 'Article title 2',
      slug: 'article-title-2',
      introduction: 'Article introduction 2',
      main: 'Article main 2',
      published_at: '2022-01-01',
      created_at: '2022-01-01',
      updated_at: '2022-01-01',
      updated_by: 'pablo',
      author: 'Article author 2',
      author_email: 'Article author_email 2',
      urls: [
        {
          type: 'website',
          url: 'https://example.com/article-title-2',
        },
      ],
    },
  ];
}

export function getMockedSlugs() {
  return [
    {
      id: 1,
      slug: 'article-title-1',
      created_at: '2022-01-01',
      article_id: 1,
      validated: 'true',
    },
    {
      id: 2,
      slug: 'article-title-2',
      created_at: '2022-01-01',
      article_id: 2,
      validated: 'true',
    },
    {
      id: 3,
      slug: 'article-title-3',
      created_at: '2022-01-01',
      article_id: 3,
      validated: 'true',
    },
    {
      id: 4,
      slug: 'article-title-4',
      created_at: '2022-01-01',
      article_id: 4,
      validated: 'true',
    },
    {
      id: 5,
      slug: 'article-title-5',
      created_at: '2022-01-01',
      article_id: 5,
      validated: 'true',
    },
    {
      id: 6,
      slug: 'article-title-6',
      created_at: '2022-01-01',
      article_id: 6,
      validated: 'true',
    },
    {
      id: 7,
      slug: 'article-title-7',
      created_at: '2022-01-01',
      article_id: 7,
      validated: 'true',
    },
    {
      id: 8,
      slug: 'article-title-8',
      created_at: '2022-01-01',
      article_id: 8,
      validated: 'true',
    },
    {
      id: 9,
      slug: 'article-title-9',
      created_at: '2022-01-01',
      article_id: 9,
      validated: 'true',
    },
    {
      id: 10,
      slug: 'article-title-10',
      created_at: '2022-01-01',
      article_id: 10,
      validated: 'true',
    },
    {
      id: 11,
      slug: 'article-title-11',
      created_at: '2022-01-01',
      article_id: 11,
      validated: 'true',
    },
  ];
}

export const getAMockedArticle = () => [
  {
    id: 16,
    slug: 'titre-de-test',
    title: 'titre de test',
    introduction:
      "passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker. Pourquoi l'utiliser? GG",
    main: "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker. Pourquoi l'utiliser? On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes).",
    main_audio_url: 'https://exmaplE.com/1.mp3',
    url_to_main_illustration: 'https://mdmd.com/iamge.jpg',
    published_at: '',
    created_at: '2025-03-24T16:46:26.434Z',
    updated_at: '2025-03-24T17:54:01.670Z',
    updated_by: 'pablo',
    author: 'psinivassin',
    author_email: 'psinivassin@gmail.com',
    urls: '',
    validated: 'false',
    shipped: 'false',
  },
];
