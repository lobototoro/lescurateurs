import { fr } from 'date-fns/locale/fr';
import { formatDistanceToNow } from 'date-fns';

import { Article } from '@/models/article';
import { getArticle } from '@/lib/articles';
import { Params } from '@/models/slugs';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const article = (await getArticle(params.slug)) as Article;
  const publishedDate =
    article.publishedAt &&
    formatDistanceToNow(article.publishedAt || '', {
      locale: fr,
      addSuffix: true,
    });

  return (
    <div className="container">
      <ArticleTitle
        text={article.title}
        level="h2"
        size="extra-large"
        color="black"
      />
      <p>{article.introduction}</p>
      <p>{article.main}</p>
      {publishedDate && <p>Article publié {publishedDate} par</p>}
      <h5>{article.author}</h5>
    </div>
  );
}
