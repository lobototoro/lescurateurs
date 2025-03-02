import { Article } from '@/models/article';
import { getArticle } from '@/lib/articles';
import { Params } from '@/models/slugs';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const article = await getArticle(params.slug) as Article;

  return (
    <div className="container">
      <ArticleTitle
        text={article.title}
        level="h2"
        size="extra-large"
        color="black" />
      <p>{article.introduction}</p>
      <p>{article.main}</p>
      <h4>{article.publishedAt}</h4>
      <h5>{article.author}</h5>
    </div>
  );
}