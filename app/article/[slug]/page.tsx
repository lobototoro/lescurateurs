import { fr } from 'date-fns/locale/fr';
import { formatDistanceToNow } from 'date-fns';

import { Article } from '@/models/article';
import { getArticle } from '@/lib/supabase/articles';
import { Params } from '@/models/slugs';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const article = (await getArticle(params.slug)) as unknown as Article;

  const publishedDate =
    article.published_at &&
    formatDistanceToNow(article.published_at || '', {
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
      <p dangerouslySetInnerHTML={{ __html: article.main }} />
      {publishedDate && <p>Article publié {publishedDate} par</p>}
      <h5>{article.author}</h5>
    </div>
  );
}
