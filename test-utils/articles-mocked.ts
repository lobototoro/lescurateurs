export async function getMockedArticles() {
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

export async function getMockedSlugs() {
  return [
    {
      id: 1,
      slug: 'article-title-1',
      createAt: '2022-01-01',
    },
    {
      id: 2,
      slug: 'article-title-2',
      createAt: '2022-01-01',
    },
  ];
}