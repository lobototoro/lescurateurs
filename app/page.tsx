// import styles from "./page.module.css";
import { getSlugs } from '@/lib/supabase/articles';
import { Slugs } from '@/models/slugs';
import { ArticleList } from './components/ArticleList';
import { Suspense } from 'react';

export default function Home() {
  const Content = async () => {
    const slugs = (await getSlugs()) as Slugs[];

    return <ArticleList list={slugs} />;
  };

  return (
    <section>
      <Suspense fallback={<p>Loading...</p>}>
        <Content />
      </Suspense>
    </section>
  );
}
