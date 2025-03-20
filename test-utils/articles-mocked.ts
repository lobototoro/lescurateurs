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