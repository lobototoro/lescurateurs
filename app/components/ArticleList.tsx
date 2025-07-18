import Link from 'next/link';
import { slugs } from "@/models/slugs";
import xss from "xss";

export const ArticleList = ({ list }: { list: slugs[] }) => {
  const unslugged = ( str: string ) => xss(str.replace(/-/g, ' '));
  const formatDate = ( date: string ) => new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ul className="container">
      {list.map(( article ) => (
        <li key={ article.id }>
          <Link href={`article/${article.slug}`}>
            { unslugged(article.slug) } - { formatDate(article.createdAt) }
          </Link>
        </li>
      ))}
    </ul>
  );
};
