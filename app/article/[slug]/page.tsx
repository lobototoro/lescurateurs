import { Article } from '@/models/article';
import { getArticle } from '@/libs/articles';
import { Params } from '@/models/slugs';

export default async function ArticlePage({ params }: { params: Params }) {
  const article = await getArticle(params.slug) as Article; 

  return (
    <>
      <h1>{article.title}</h1>
      <p>{article.introduction}</p>
      <p>{article.main}</p>
      <p>{article.publishedAt}</p>
      <p>{article.author}</p>
    </>
  );
}