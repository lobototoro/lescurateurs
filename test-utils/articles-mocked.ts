export function getMockedArticles() {
  return [
    {
      id: 1,
      title: 'Article title 1',
      slug: 'article-title-1',
      introduction: 'Article introduction 1',
      main: 'Article main 1',
      publishedAt: '2022-01-01',
      createAt: '2022-01-01',
      updateAt: '2022-01-01',
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
      publishedAt: '2022-01-01',
      createAt: '2022-01-01',
      updateAt: '2022-01-01',
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
      createdAt: '2022-01-01',
      articleId: 1
    },
    {
      id: 2,
      slug: 'article-title-2',
      createdAt: '2022-01-01',
      articleId: 2
    },
    {
      id: 3,
      slug: 'article-title-3',
      createdAt: '2022-01-01',
      articleId: 3
    },
    {
      id: 4,
      slug: 'article-title-4',
      createdAt: '2022-01-01',
      articleId: 4
    },
    {
      id: 5,
      slug: 'article-title-5',
      createdAt: '2022-01-01',
      articleId: 5
    },
    {
      id: 6,
      slug: 'article-title-6',
      createdAt: '2022-01-01',
      articleId: 6
    },
    {
      id: 7,
      slug: 'article-title-7',
      createdAt: '2022-01-01',
      articleId: 7
    },
    {
      id: 8,
      slug: 'article-title-8',
      createdAt: '2022-01-01',
      articleId: 8
    },
    {
      id: 9,
      slug: 'article-title-9',
      createdAt: '2022-01-01',
      articleId: 9
    },
    {
      id: 10,
      slug: 'article-title-10',
      createdAt: '2022-01-01',
      articleId: 10
    },
    {
      id: 11,
      slug: 'article-title-11',
      createdAt: '2022-01-01',
      articleId: 11
    },
  ];
}

export const getAMockedArticle = () => [
  {
    id: 16,
    slug: 'titre-de-test',
    title: 'titre de test',
    introduction: 'passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n' +
      "Pourquoi l'utiliser? GG",
    main: "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n" +
      "Pourquoi l'utiliser?\r\n" +
      '\r\n' +
      "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes).",
    mainAudioUrl: 'https://exmaplE.com/1.mp3',
    urlToMainIllustration: 'https://mdmd.com/iamge.jpg',
    publishedAt: '',
    createdAt: '2025-03-24T16:46:26.434Z',
    updatedAt: '2025-03-24T17:54:01.670Z',
    author: 'psinivassin',
    author_email: 'psinivassin@gmail.com',
    urls: '',
    validated: 'false',
    shipped: 'false'
  }
];