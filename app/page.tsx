import { getSlugs } from '@/lib/supabase/articles';
import { ArticleList } from './components/ArticleList';
import { Suspense } from 'react';

export default async function Home() {
  const slugs = await getSlugs();

  return (
    <section>
      <Suspense fallback={<p>Loading...</p>}>
        <ArticleList list={slugs} />
      </Suspense>
    </section>
  );
}
