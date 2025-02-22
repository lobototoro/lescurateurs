import { Article } from '@/models/article';
import { getArticle } from '@/lib/articles';
import { Params } from '@/models/slugs';

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const params = await props.params;
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